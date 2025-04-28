export async function POST(request) {
    const { kode, nama } = await request.json();

    if (!kode || !nama) {
        return new Response(JSON.stringify ({ error: 'Semua field wajib diisi' }), {
            status: 400,
        });
    }

    const matkul = await prisma.matkul.create({
        data: { kode, nama },
    });

    return new Response(JSON.stringify(matkul), { status: 201 });
}
