'use server'

import { prisma } from '@/lib/prisma';
import { Event } from '@prisma/client';

export type EventWithCount = Event & {
    _count: {
        bookings: number;
    }
};

export async function getEvents(start: Date, end: Date): Promise<EventWithCount[]> {
    try {
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
                }
            },
            orderBy: {
                startTime: 'asc',
            }
        });
        return events;
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
