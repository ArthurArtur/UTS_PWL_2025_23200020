import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const preorders = await prisma.preorder.findMany({
            orderBy: { id: 'asc' },
        });

        const result = preorders.map(order => ({
            id: order.id,
            order_date: order.order_date.toISOString().split('T')[0],
            order_by: order.order_by,
            selected_package: order.selected_package,
            qty: order.qty,
            status: order.is_paid ? 'Lunas' : 'Belum Lunas',
        }));

        return new Response(JSON.stringify(result), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Gagal mengambil data' }), { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order_date, order_by, selected_package, qty, status } = body;

        if (!order_date || !order_by || !selected_package || !qty || !status) {
            return new Response(JSON.stringify({ error: 'Semua field wajib diisi' }), { status: 400 });
        }

        const formattedDate = new Date(order_date);
        const isPaid = status === 'Lunas';

        const createdOrder = await prisma.preorder.create({
            data: {
                order_date: formattedDate,
                order_by,
                selected_package,
                qty: parseInt(qty),
                is_paid: isPaid,
            },
        });

        return new Response(JSON.stringify(createdOrder), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Gagal menyimpan data' }), { status: 500 });
    }
}
