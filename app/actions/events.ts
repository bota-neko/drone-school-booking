'use server'

import { prisma } from '@/lib/prisma';
import { Event } from '@prisma/client';
import { verifySession } from '@/lib/session';

export type EventWithCount = Event & {
    _count: {
        bookings: number;
    };
    isBooked?: boolean;
};

export async function getEvents(start: Date, end: Date): Promise<EventWithCount[]> {
    try {
        const session = await verifySession();
        const userId = session?.userId;

        const events = await prisma.event.findMany({
            where: {
                startTime: {
                    gte: start,
                },
                endTime: {
                    lte: end,
                },
            },
            include: {
                _count: {
                    select: { bookings: { where: { status: 'CONFIRMED' } } }
                },
                ...(userId ? {
                    bookings: {
                        where: { userId: userId, status: 'CONFIRMED' },
                        select: { id: true }
                    }
                } : {})
            },
            orderBy: {
                startTime: 'asc',
            }
        });

        return events.map(event => ({
            ...event,
            isBooked: userId ? (event.bookings && event.bookings.length > 0) : false,
            bookings: undefined // Remove the bookings array from response to keep payload light
        }));
    } catch (error) {
        console.error("Failed to fetch events", error);
        return [];
    }
}

export async function getAdminEvents(start: Date, end: Date) {
    try {
        const events = await prisma.event.findMany({
            where: {
                startTime: { gte: start },
                endTime: { lte: end },
            },
            include: {
                _count: {
                    select: { bookings: true }
                },
                bookings: {
                    include: {
                        user: {
                            include: { profile: true }
                        }
                    }
                }
            },
            orderBy: { startTime: 'asc' }
        });
        return events;
    } catch (error) {
        console.error("Failed to fetch admin events", error);
        return [];
    }
}
