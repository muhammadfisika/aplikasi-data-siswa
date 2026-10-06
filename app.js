// ======================================
// APLIKASI DATA SISWA
// TAHAP 2
// ======================================


// Ambil elemen form
const formSiswa = document.getElementById("formSiswa");


// Ambil elemen pencarian
const searchInput = document.getElementById("searchInput");


// Ambil tabel siswa
const tabelSiswa = document.getElementById("tabelSiswa");


// Data sementara untuk latihan
// Pada tahap berikutnya data ini akan diganti
// dengan data dari Firebase Firestore.

let dataSiswa = [];


// ======================================
// SIMPAN DATA
// ======================================

formSiswa.addEventListener("submit", function(event) {

  event.preventDefault();


  // Ambil nilai form

  const nisn =
    document.getElementById("nisn").value.trim();

  const nama =
    document.getElementById("nama").value.trim();

  const kelas =
    document.getElementById("kelas").value;


  // Validasi

  if (!nisn || !nama || !kelas) {

    alert("Semua data harus diisi.");

    return;
  }


  // Buat objek siswa

  const siswa = {

    nisn: nisn,
    nama: nama,
    kelas: kelas

  };


  // Masukkan ke array

  dataSiswa.push(siswa);


  // Tampilkan data

  tampilkanSiswa(dataSiswa);


  // Kosongkan form

  formSiswa.reset();


  alert("Data siswa berhasil ditambahkan.");

});


// ======================================
// TAMPILKAN DATA
// ======================================

function tampilkanSiswa(data) {

  tabelSiswa.innerHTML = "";


  if (data.length === 0) {

    tabelSiswa.innerHTML = `

      <tr>

        <td
          colspan="5"
          class="empty"
        >
          Belum ada data siswa.
        </td>

      </tr>

    `;

    return;
  }


  data.forEach(function(siswa, index) {

    const row = document.createElement("tr");


    row.innerHTML = `

      <td>
        ${index + 1}
      </td>

      <td>
        ${siswa.nisn}
      </td>

      <td>
        ${siswa.nama}
      </td>

      <td>
        ${siswa.kelas}
      </td>

      <td>
        <button
          onclick="hapusSiswa(${index})"
        >
          Hapus
        </button>
      </td>

    `;


    tabelSiswa.appendChild(row);

  });

}


// ======================================
// HAPUS DATA
// ======================================

function hapusSiswa(index) {

  const konfirmasi =
    confirm("Hapus data siswa ini?");


  if (!konfirmasi) {

    return;
  }


  dataSiswa.splice(index, 1);


  tampilkanSiswa(dataSiswa);

}


// ======================================
// PENCARIAN
// ======================================

searchInput.addEventListener(
  "input",
  function() {

    const keyword =
      searchInput.value
        .toLowerCase()
        .trim();


    const hasil =
      dataSiswa.filter(function(siswa) {

        return (

          siswa.nama
            .toLowerCase()
            .includes(keyword)

          ||

          siswa.nisn
            .toLowerCase()
            .includes(keyword)

          ||

          siswa.kelas
            .toLowerCase()
            .includes(keyword)

        );

      });


    tampilkanSiswa(hasil);

  }
);
