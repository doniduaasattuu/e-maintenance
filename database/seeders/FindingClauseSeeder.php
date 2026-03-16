<?php

namespace Database\Seeders;

use App\Models\FindingClause;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FindingClauseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $finding_clauses = [
            [
                "code" => "R1.1",
                "title" => "5R K3",
                "description" => "Adanya pemilahan antara barang yang masih dipakai & sudah tidak terpakai.",
            ],
            [
                "code" => "R1.2",
                "title" => "5R K3",
                "description" => "Adanya identifikasi barang &daftar list barang yang dibutuhkan.",
            ],
            [
                "code" => "R1.3",
                "title" => "5R K3",
                "description" => "Adanya area Red Tag minimal 1 per masing-masing circle.",
            ],
            [
                "code" => "R1.4",
                "title" => "5R K3",
                "description" => "Adanya list tagging di area red tag & masa simpan.",
            ],
            [
                "code" => "R1.5",
                "title" => "5R K3",
                "description" => "Apakah barang yang tidak dibutuhkan sudah di-identifikasi dan diberi tag?.",
            ],
            [
                "code" => "R2.1",
                "title" => "5R K3",
                "description" => "Barang yang disimpan harus dikelompokkan sesuai fungsi atau kondisinya.",
            ],
            [
                "code" => "R2.2",
                "title" => "5R K3",
                "description" => "Ada layout dan denah setiap bangunan untuk penempatan barang.",
            ],
            [
                "code" => "R2.3",
                "title" => "5R K3",
                "description" => "Tata letak/penempatan barang tidak mengganggu proses berikutnya atau aktivitas.",
            ],
            [
                "code" => "R2.4",
                "title" => "5R K3",
                "description" => "Lokasi penempatan diidentifikasi dengan jelas, ada pengkodean, dan terlihat jelas.",
            ],
            [
                "code" => "R2.5",
                "title" => "5R K3",
                "description" => "Ada list barang (termasuk jumlah) dan lokasi penempatannya.",
            ],
            [
                "code" => "R2.6",
                "title" => "5R K3",
                "description" => "Apakah semua barang diletakkan sesuai lokasi-nya.",
            ],
            [
                "code" => "R3.1",
                "title" => "5R K3",
                "description" => "Adanya sarana/alat kebersihan, tempat sampah memadai, & penempatannya.",
            ],
            [
                "code" => "R3.2",
                "title" => "5R K3",
                "description" => "Lantai & bangunan bersih dari sampah dan kotoran.",
            ],
            [
                "code" => "R3.3",
                "title" => "5R K3",
                "description" => "Peralatan kerja/equipment/mesin bebas dari debu, sampah, dan kotoran.",
            ],
            [
                "code" => "R3.4",
                "title" => "5R K3",
                "description" => "Atap/langit-langit bebas dari sarang laba-laba (batas 3m).",
            ],
            [
                "code" => "R3.5",
                "title" => "5R K3",
                "description" => "Atap/langit-langit bebas dari sarang laba-laba (lebih dari 3m).",
            ],
            [
                "code" => "R3.6",
                "title" => "5R K3",
                "description" => "Tidak ditemukan sumber kotoran/bocor.",
            ],
            [
                "code" => "R3.7",
                "title" => "5R K3",
                "description" => "Tidak ditemukan barang atau bangunan yang rusak.",
            ],

            [
                "code" => "K3L.1",
                "title" => "5R K3",
                "description" => "Tidak ada kondisi mesin, peralatan & building dalam kondisi unsafe condition.",
            ],
            [
                "code" => "K3L.2",
                "title" => "5R K3",
                "description" => "Tidak ada aktivitas yang berpotensi menyebabkan kecelakaan dan penyakit akibat kerja (unsafe action).",
            ],
            [
                "code" => "K3L.3",
                "title" => "5R K3",
                "description" => "Tidak adanya material B3 yang bocor/tumpah di area kerja.",
            ],
        ];

        collect($finding_clauses)->each(fn($fc) => FindingClause::create($fc));
    }
}
