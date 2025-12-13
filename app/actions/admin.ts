'use server'

import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { addDays, addWeeks, addMonths, setHours, setMinutes, eachHourOfInterval } from 'date-fns';

export async function createEvent(formData: FormData) {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const title = formData.get('title') as string;
    const type = formData.get('type') as string; // 'SEMINAR' | 'FREE_PRACTICE'
    const dateStr = formData.get('date') as string;
    const startTimeStr = formData.get('startTime') as string; // HH:mm
    const endTimeStr = formData.get('endTime') as string; // HH:mm
    const maxAttendees = parseInt(formData.get('maxAttendees') as string || '1');
    const price = parseInt(formData.get('price') as string || '0');
    const recurrence = formData.get('recurrence') as string; // 'NONE', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'

    // Basic date construction with JST forced (+09:00)
    // Input dateStr: YYYY-MM-DD
    // Input startTimeStr: HH:mm
    // Result: UTC Timestamp that represents the input time in JST.
    const startDateTime = new Date(`${dateStr}T${startTimeStr}:00+09:00`);
    const endDateTime = new Date(`${dateStr}T${endTimeStr}:00+09:00`);

    try {
        if (type === 'FREE_PRACTICE') {
            // Generate slots
            const hours = eachHourOfInterval({ start: startDateTime, end: endDateTime });
            // remove last one if it matches endExactly? eachHourOfInterval returns start and end inclusive
            // e.g. 12:00 to 15:00 -> 12, 13, 14, 15. We want slots 12-13, 13-14, 14-15.
            // So we iterate until length-1

            const transactions = [];
            for (let i = 0; i < hours.length - 1; i++) {
                const s = hours[i];
                const e = hours[i + 1]; // 1 hour later

                transactions.push(prisma.event.create({
                    data: {
                        title: title || 'Free Practice',
                        type: 'FREE_PRACTICE',
                        startTime: s,
                        endTime: e,
                        maxAttendees, // Per slot
                        price,
                        isSlot: true,
                        location: 'Field A', // Default or from form
                    }
                }));
            }
            await prisma.$transaction(transactions);

        } else {
            // Seminar (with recurrence)
            // For MVP, create just one or simple loop
            let datesToCreate = [startDateTime];
            if (recurrence === 'WEEKLY') {
                for (let i = 1; i < 4; i++) datesToCreate.push(addWeeks(startDateTime, i));
            } else if (recurrence === 'BIWEEKLY') {
                for (let i = 1; i < 4; i++) datesToCreate.push(addWeeks(startDateTime, i * 2));
            }

            const transactions = datesToCreate.map(d => {
                const duration = endDateTime.getTime() - startDateTime.getTime();
                const e = new Date(d.getTime() + duration);
                return prisma.event.create({
                    data: {
                        title,
                        type: 'SEMINAR',
                        startTime: d,
                        endTime: e,
                        maxAttendees, // Use form value
                        price,
                        location: 'Classroom',
                    }
                });
            });

            await prisma.$transaction(transactions);
        }
    } catch (e: any) {
        console.error(e);
        // Throwing error allows the nearest Error Boundary to catch it
        throw new Error("Failed to create events");
    }

    revalidatePath('/calendar');
    revalidatePath('/admin');
    redirect('/admin');
}

// Upsert (Create or Update) free practice slots
export async function quickUpsertFreePractice(date: string, startTimes: string[], maxAttendees: number = 1) {
    const session = await verifySession();
    if (!session?.isAuth || session.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    if (!startTimes || startTimes.length === 0) {
        return { message: 'No slots selected' };
    }

    try {
        await prisma.$transaction(async (tx) => {
            for (const time of startTimes) {
                const startDateTime = new Date(`${date}T${time}`);
                // Assume 1 hour default duration
                const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

                // Check for existing event specifically at this time
                const existing = await tx.event.findFirst({
                    where: {
                        startTime: startDateTime,
                        endTime: endDateTime,
                        type: 'FREE_PRACTICE'
                    }
                });

                if (existing) {
                    // Update existing
                    await tx.event.update({
                        where: { id: existing.id },
                        data: { maxAttendees }
                    });
                } else {
                    // Create new
                    await tx.event.create({
                        data: {
                            type: 'FREE_PRACTICE',
                            title: '自由練習',
                            startTime: startDateTime,
                            endTime: endDateTime,
                            maxAttendees,
                            price: 0,
                            isSlot: true
                        }
                    });
                }
            }
        });

        revalidatePath('/calendar');
        revalidatePath('/admin');
        return { success: true, message: 'Updated slots.' };
    } catch (error) {
        console.error('Quick Upsert Error:', error);
        throw new Error('Failed to update slots');
    }
}

// Delete free practice slots
export async function quickDeleteFreePractice(date: string, startTimes: string[]) {
    const session = await verifySession();
    if (!session?.isAuth || session.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    if (!startTimes || startTimes.length === 0) {
        return { message: 'No slots selected' };
    }

    try {
        await prisma.$transaction(async (tx) => {
            for (const time of startTimes) {
                const startDateTime = new Date(`${date}T${time}`);

                // Find event to delete (be safe about types)
                const existing = await tx.event.findFirst({
                    where: {
                        startTime: startDateTime,
                        type: 'FREE_PRACTICE'
                    }
                });

                if (existing) {
                    // Start soft/hard delete decision. User implies hard delete logic for "management".
                    // But if bookings exist, prisma will fail if we set Relation to Restrict, or delete bookings if Cascade.
                    // Schema says: bookings properties: onDelete: Cascade. So bookings will be deleted!
                    // This is acceptable/expected for "Editor" tool usually, but risky. 
                    // Let's proceed as allowed.
                    await tx.event.delete({
                        where: { id: existing.id }
                    });
                }
            }
        });

        revalidatePath('/calendar');
        revalidatePath('/admin');
        return { success: true, message: 'Deleted slots.' };
    } catch (error) {
        console.error('Quick Delete Error:', error);
        throw new Error('Failed to delete slots');
    }
}

// Get all general users
export async function getUsers() {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') {

        throw new Error("Unauthorized");
    }

    try {
        const users = await prisma.user.findMany({
            where: { role: 'USER' },
            select: {
                id: true,
                email: true,
                createdAt: true,
                profile: {
                    select: {
                        fullName: true
                    }
                },
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return users;
    } catch (error) {
        console.error("Failed to fetch users:", error);
        throw new Error("Failed to fetch users");
    }
}

// Delete a user
export async function deleteUser(userId: string) {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.user.delete({
            where: { id: userId }
        });

        revalidatePath('/admin/users');
        revalidatePath('/admin/bookings'); // Bookings are deleted, so update list
        return { success: true };
    } catch (error) {
        console.error("Failed to delete user:", error);
        throw new Error("Failed to delete user");
    }
}

// Update Event
export async function updateEvent(eventId: string, formData: FormData) {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const maxAttendees = parseInt(formData.get('maxAttendees') as string || '0');
    const price = parseInt(formData.get('price') as string || '0');

    try {
        await prisma.event.update({
            where: { id: eventId },
            data: {
                title,
                location,
                maxAttendees,
                price
            }
        });

        revalidatePath('/admin');
        revalidatePath('/calendar');
        return { success: true, message: 'イベントを更新しました。' };
    } catch (error) {
        console.error("Failed to update event:", error);
        throw new Error("Failed to update event");
    }
}

// Delete Event
export async function deleteEventAction(eventId: string) {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.event.delete({
            where: { id: eventId }
        });

        revalidatePath('/admin');
        revalidatePath('/calendar');
        return { success: true, message: 'イベントを削除しました。' };
    } catch (error) {
        console.error("Failed to delete event:", error);
        throw new Error("Failed to delete event");
    }
}

// Delete All Events (Danger Zone)
export async function deleteAllEvents() {
    const session = await verifySession();
    if (session?.role !== 'ADMIN') {
        throw new Error("Unauthorized");
    }

    try {
        // Delete all events
        // Note: This will Cascade delete bookings due to schema relation if defined,
        // or fail if RESTRICT. Usually Schema is Cascade for booking->event.
        // Let's create a transaction to be safe.
        await prisma.event.deleteMany({});

        revalidatePath('/calendar');
        revalidatePath('/admin');
        return { success: true, message: '全ての予約枠を削除しました。' };
    } catch (error) {
        console.error("Failed to delete all events:", error);
        return { success: false, message: '削除に失敗しました。' };
    }
}


