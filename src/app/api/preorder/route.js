import prisma from '@/lib/prisma';

// Helper to format preorder record
function formatPreorder(item) {
    return {
        id: item.id,
        order_date: item.order_date.toISOString().split('T')[0],
        order_by: item.order_by,
        selected_package: item.selected_package,
        qty: item.qty,
        status: item.is_paid ? "Lunas" : "Belum Lunas",
    };
}

export async function GET() {
    const data = await prisma.preorder.findMany({
        orderBy: { id: 'asc' },
    });

    const formatted = data.map(formatPreorder);

    return new Response(
        JSON.stringify(formatted),
        { status: 200 }
    );
}

export async function POST(request) {
    const {
        order_date,
        order_by,
        selected_package,
        qty,
        status
    } = await request.json();

    const requiredFields = [order_date, order_by, selected_package, qty, status];
    const missing = requiredFields.some(field => !field);

    if (missing) {
        return new Response(
            JSON.stringify({ error: 'Semua field wajib diisi' }),
            { status: 400 }
        );
    }

    const newOrderDate = new Date(order_date).toISOString();
    const is_paid = status === 'Lunas';

    const preorder = await prisma.preorder.create({
        data: {
            order_date: newOrderDate,
            order_by,
            selected_package,
            qty: parseInt(qty),
            is_paid,
        },
    });

    const responseData = {
        id: preorder.id,
        order_date: preorder.order_date.toISOString().split('T')[0],
        order_by: preorder.order_by,
        selected_package: preorder.selected_package,
        qty: preorder.qty,
        status: is_paid ? 'Lunas' : 'Belum Lunas',
    };

    return new Response(
        JSON.stringify(responseData),
        { status: 201 }
    );
}
