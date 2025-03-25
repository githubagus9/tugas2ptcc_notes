// Ngambil elemen form
const formulir = document.querySelector("form");

const url = "https://bagusbe-970101336895.us-central1.run.app";

// Bikin trigger event submit pada elemen form
formulir.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Ngambil elemen input
  const elemen_title = document.querySelector("#title");
  const elemen_content = document.querySelector("#content");

  // Ngambil value dari elemen input
  const title = elemen_title.value.trim();
  const content = elemen_content.value.trim();

  if (!title || !content) {
    alert("Judul dan Isi Catatan tidak boleh kosong!");
    return;
  }

  const id = elemen_title.dataset.id ? elemen_title.dataset.id : ""; // Cek dataset.id

  try {
    if (id === "") {
      // Tambah note (POST)
      await axios.post(`${url}/notes`, { title, content }, {
        headers: { "Content-Type": "application/json" }
      });
    } else {
      // Update note (PUT)
      await axios.patch(`${url}/notes/${id}`, { title, content }, {
        headers: { "Content-Type": "application/json" }
      });
    }

    resetForm();
    getNotes();
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    alert("Terjadi kesalahan saat menyimpan data!");
  }
});

// Fungsi Reset Form
function resetForm() {
  const elemen_title = document.querySelector("#title");
  const elemen_content = document.querySelector("#content");

  elemen_title.removeAttribute("data-id");
  elemen_title.value = "";
  elemen_content.value = "";

  document.querySelector("button[type='submit']").textContent = "Simpan"; // Kembalikan tombol ke mode "Simpan"
}

// GET Notes
async function getNotes() {
  try {
    const { data } = await axios.get(`${url}/notes`);

    const table = document.querySelector("#table-notes");
    let tampilan = "";
    let no = 1;

    for (const note of data) {
      tampilan += tampilkanNote(no, note);
      no++;
    }
    table.innerHTML = tampilan;
    hapusNote();
    editNote();
  } catch (error) {
    console.log(error.message);
  }
}

function tampilkanNote(no, note) {
  return `
    <tr>
      <td>${no}</td>
      <td class="title">${note.title}</td>
      <td class="content">${note.content}</td>
      <td><button data-id="${note.id}" class='btn-edit'>Edit</button></td>
      <td><button data-id="${note.id}" class='btn-hapus'>Hapus</button></td>
    </tr>
  `;
}

function hapusNote() {
  const kumpulan_tombol_hapus = document.querySelectorAll(".btn-hapus");

  kumpulan_tombol_hapus.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        await axios.delete(`${url}/notes/${id}`);
        getNotes();
      } catch (error) {
        console.log("Gagal menghapus:", error);
      }
    });
  });
}

function editNote() {
  const kumpulan_tombol_edit = document.querySelectorAll(".btn-edit");

  kumpulan_tombol_edit.forEach((tombol_edit) => {
    tombol_edit.addEventListener("click", () => {
      // Ngambil value yg ada di form
      const id = tombol_edit.dataset.id;
      const title =
        tombol_edit.parentElement.parentElement.querySelector(
          ".title"
        ).innerText;
      const content =
        tombol_edit.parentElement.parentElement.querySelector(
          ".content"
        ).innerText;

      // Ngambil elemen input
      const elemen_title = document.querySelector("#title");
      const elemen_content = document.querySelector("#content");

      // Masukkan value yang ada di baris yang dipilih ke form
      elemen_title.dataset.id = id;
      elemen_title.value = title;
      elemen_content.value = content;

      // Ubah tombol submit jadi "Update"
      document.querySelector("button[type='submit']").textContent = "Update";
    });
  });
}

// Panggil data pertama kali
getNotes();
