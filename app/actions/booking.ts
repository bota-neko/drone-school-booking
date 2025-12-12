'use server'

import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { sendBookingConfirmation, sendCancellationEmail, sendAdminBookingNotification } from '@/lib/mail';
// import { redirect } from 'next/navigation';

export async function bookEvent(eventId: string) {
    const session = await verifySession();
    if (!session || !session.userId) {
        throw new Error("Unauthorized");
    }

    try {
        // Fetch user email for notification
        const user = await prisma.user.findUnique({
            where: { id: session.userId }
        });

        if (!user) throw new Error("User not found");

        // Transaction to ensure slot availability
        await prisma.$transaction(async (tx) => {
            const event = await tx.event.findUnique({
                where: { id: eventId },
                include: { bookings: true } // or count bookings
            });

            if (!event) {
                throw new Error("Event not found");
            }

            const currentBookings = await tx.booking.count({
                where: { eventId, status: 'CONFIRMED' }
            });

            if (currentBookings >= event.maxAttendees) {
                throw new Error("Event is full");
            }

            // Check if user already booked
            const existing = await tx.booking.findUnique({
                where: {
                    userId_eventId: {
                        userId: session.userId,
                        eventId: eventId
                    }
                }
            });

            if (existing) {
                throw new Error("You have already booked this event");
            }

            await tx.booking.create({
                data: {
                    userId: session.userId,
                    eventId: eventId,
                    status: 'CONFIRMED'
                }
            });

            // Send email (fire and forget inside transaction? No, better outside or just await it. 
            // Await is safer to ensure it doesn't fail silently, but we don't want to rollback booking if email fails.
            // For now, let's await it but catch error inside the mail function so it doesn't throw.)
            await sendBookingConfirmation(user.email, event);

            // Notify Admin
            // Fetch profile name or fallback
            const profile = await tx.profile.findUnique({ where: { userId: user.id } });
            const userName = profile?.fullName || 'No Name';
            await sendAdminBookingNotification(event, user.email, userName);
        });
    } catch (error: any) {
        console.error('Booking failed:', error);
        return { success: false, message: error.message || '予約に失敗しました。' };
    }

    revalidatePath('/calendar');
    revalidatePath('/my-page');
    revalidatePath('/admin/bookings');
    return { success: true, message: '予約が完了しました。' };
}

export async function cancelBooking(bookingId: string) {
    console.log('[CancelBooking] Starting cancellation for bookingId:', bookingId);
    const session = await verifySession();

    if (!session || !session.userId) {
        console.error('[CancelBooking] Unauthorized: No session or userId');
        throw new Error("Unauthorized");
    }
    console.log('[CancelBooking] User authenticated:', session.userId);

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { event: true, user: true }
        });

        if (!booking) {
            console.error('[CancelBooking] Booking not found:', bookingId);
            throw new Error("Booking not found");
        }

        if (booking.userId !== session.userId && session.role !== 'ADMIN') {
            console.error('[CancelBooking] Unauthorized user mismatch. Booking User:', booking.userId, 'Session User:', session.userId);
            throw new Error("Unauthorized to cancel this booking");
        }

        // Hard delete as requested
        await prisma.booking.delete({
            where: { id: bookingId }
        });

        console.log(`[CancelBooking] Successfully deleted booking ${bookingId}`);
        // Send cancellation email
        await sendCancellationEmail(booking.user.email, booking.event);

    } catch (error: any) {
        console.error('[CancelBooking] Cancellation failed with error:', error);
        return { success: false, message: error.message || 'キャンセルに失敗しました。' };
    }

    revalidatePath('/calendar');
    revalidatePath('/my-page');
    revalidatePath('/admin/bookings');
    return { success: true, message: '予約をキャンセルしました。' };
}


