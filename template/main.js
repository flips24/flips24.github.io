// Dropdown wilayah
const wrapper = document.querySelector(".wrapper"),
      selectBtn = wrapper.querySelector(".select-btn"),
      options = wrapper.querySelector(".options");

selectBtn.addEventListener("click", () => {
    if (analyze.value == "off") {
        swal.fire({
            title: "Silakan Klik Tombol Analisa Terlebih Dahulu!",
            icon: "error",
            timer: 3000,
            showConfirmButton: false
        });
    }
});

// Array wilayah (dari gsheet)
let cities = ['Kota Surabaya', 'Sidoarjo', 'Malang', 'Kota Malang', 'Pasuruan', 'Kota Pasuruan', 'Kota Batu', 'Probolinggo', 'Ponorogo', 
'Banyuwangi', 'Madiun', 'Kota Madiun', 'Mojokerto', 'Kota Mojokerto', 'Blitar', 'Ngawi', 'Nganjuk', 'Bojonegoro', 'Tuban', 'Lamongan', 
'Magetan', 'Gresik', 'Bondowoso', 'Situbondo', 'Lumajang', 'Jember', 'Trenggalek', 'Tulungagung', 'Kediri', 'Pacitan', 'Jombang', 
'Bangkalan', 'Sampang', 'Pamekasan', 'Sumenep', 'Kota Kediri', 'Kota Probolinggo', 'Kota Blitar'];

function addWil(kotaTerpilih) {
    options.innerHTML = "";
    if (kotaTerpilih == null) {
        // Mapping list cities ke dropdown wilayah
        let kabkotAwal = cities.map(kota => `<li onclick="updateName(this); filterBerita()">${kota}</li>`).join("");
        options.innerHTML = kabkotAwal;
    } else {
        // Array kabkot baru yang terurut dan langsung mapping ke dropdown wilayah
        let kabkotMurup = cities.sort((x,y) => x == kotaTerpilih ? -1 : y == kotaTerpilih ? 1 : 0)
                            .map(data => `<li onclick="updateName(this); filterBerita()">${data}</li>`).join("");
        options.innerHTML = kabkotMurup;
        
        // MENYALA Abangkuuh 🔥🔥
        let menyala = document.querySelector(".options li");
        menyala.setAttribute("class", "terpilih");
    }
    
}

function updateName(selectedLi) {
    // Kosongkan inputnya setelah diklik
    kabkot.value = "";

    addWil(selectedLi.innerHTML);
    wrapper.classList.remove("active");
    selectBtn.firstElementChild.innerHTML = selectedLi.innerHTML;
}

function filterBerita() {
    console.log(selectBtn.firstElementChild.innerHTML)
}


function analisa() {
    if (analyze.value == "off") {
        analyze.value = "on";
        analyze.innerHTML = "Reset!";


        // Munculkan 5 komoditas
        // Array komoditas (dari hasil korelasi)
        let commodities = ['Migor kemasan sederhana', 'Migor curah', 'Pupuk ZA', 'Buncis', 'Paku ukuran 5cm'];
        let idKom = [95, 10, 88, 48, 79];

        // Append array komoditas dan valuenya ke dropdown komoditas
        for (let i = 0; i < commodities.length; i++) {
            let pil = document.createElement('option');
            pil.innerHTML = commodities[i];
            bapo.appendChild(pil);
            bapo.querySelectorAll('option')[i+1].value = idKom[i];
                bapo.querySelectorAll('option')[i+1].setAttribute("jenis", commodities[i].split(" ")[0].toLowerCase());
        }

        // Munculkan wilayah
        addWil();

        // Tampilkan pesan berhasil
        swal.fire({
            title: "Proses Selesai!",
            icon: "success",
        });

        
        // Untuk placeholder
        let pholders = ['Cari kotanya ...', 'Tekan ⬆️ atau ⬇️ untuk menelusuri', 'Tekan Enter untuk memilih', 'Tekan esc untuk batal'];
        function showPlaceHolders() {
            let i = 0;
        
            // Placeholder awal
            let teks = pholders[i++ % pholders.length]; // modulo
            kabkot.placeholder = teks;
            
            // Berubah setiap 5 detik
            setInterval(() => {
                let teks = pholders[i++ % pholders.length]; // modulo
                kabkot.placeholder = teks;
            }, 5000);
        }
        showPlaceHolders();

        kabkot.addEventListener('keyup', (e) => {
            if (((e.keyCode != 40 || e.keyCode != 38) || (e.keyCode != 13 || e.keyCode != 27)) || 
                e.keyCode != 8) {
                let searchedVal = kabkot.value.toLowerCase();
                let arr = cities.filter(data => {
                    return data.toLowerCase().includes(searchedVal);
                });
                let murup = selectBtn.firstElementChild.innerHTML;
            
                if (murup.includes("---") || !arr.includes(murup)) {
                    // Mengembalikan array kabkot dari input yg diketikkan user
                    // Dan mapping array ini ke list kabkot serta join semuanya
                    arr = arr.map(data => `<li onclick="updateName(this); filterBerita()">${data}</li>`).join("");
                    options.innerHTML = arr ? arr : `<p style="font-size: 12px;">Maaf, kabupaten/kota tidak ditemukan!</p>`;
                }
                if (arr.includes(murup)) {
                    // Array kabkot baru yang terurut
                    let kabkotMurup = arr.sort((x,y) => x == murup ? -1 : y == murup ? 1 : 0)
                                      // Kemudian mapping dan join ke dropdown wilayah
                                      .map(data => `<li onclick="updateName(this); filterBerita()">${data}</li>`).join("");
                    options.innerHTML = kabkotMurup;
            
                    // MENYALA Abangkuuh 🔥🔥
                    let menyala = document.querySelector(".options li");
                    menyala.setAttribute("class", "terpilih");
            
                }
            } 
        
            // Escape, down, up, enter, backspace
            let elem = document.querySelectorAll(".options li");
            let sorot;
        
                // Escape
                if (e.keyCode == 27) {
                    let murup = selectBtn.firstElementChild.innerHTML;
                    let menyala = document.querySelector(".options li");
        
                    // Cek apakah sudah pernah filter kabkot
                    if (menyala.classList[0] == undefined) {
                        if (!murup.includes("---")) {
                            addWil(murup);
                            kabkot.value = "";
                        } else {
                            addWil();
                            kabkot.value = "";
                        }
                    } else {
                        addWil(menyala.innerHTML);
                        kabkot.value = "";
                    }
                    
                    wrapper.classList.remove("active");
                    hitung.innerHTML = -1;
                    countIsi.innerHTML = -1;
                }
        
                // Down
                if (e.keyCode == 40) {
                    // Jika belum pernah search
                    if (kabkot.value == "") {
                        // Abaikan saja, karena ada 38 baris
                        sorot = elem[++hitung.innerHTML];
                        sorot.classList.add("tersorot");
                    } else {
                        // Sudah pernah search
                        if (countIsi.innerHTML >= elem.length-1) {
                            sorot = elem[elem.length-1];
                            sorot.classList.add("tersorot");   
                        }
                        if (countIsi.innerHTML == elem.length-1) {
                            sorot = elem[elem.length-1];
                            sorot.classList.add("tersorot");   
                        }
                        if (countIsi.innerHTML < elem.length-1) {
                            sorot = elem[++countIsi.innerHTML];
                            sorot.classList.add("tersorot");   
                        }
                        
                    }
                }
                
                // Up
                if (e.keyCode == 38) {
                    // Jika belum pernah search
                    if (kabkot.value == "") {
                        if (hitung.innerHTML <= -1) {
                            sorot = elem[0];
                            sorot.classList.add("tersorot");
                            hitung.innerHTML = 0;
                        }
                        if (hitung.innerHTML == 0) {
                            sorot = elem[0];
                            sorot.classList.add("tersorot");
                        }
                        if (hitung.innerHTML > 0) {
                            sorot = elem[--hitung.innerHTML];
                            sorot.classList.add("tersorot");
                        }
                    } else {
                        // Sudah pernah search
                        if (countIsi.innerHTML <= -1) {
                            sorot = elem[0];
                            sorot.classList.add("tersorot");
                            countIsi.innerHTML = 0;
                        }
                        if (countIsi.innerHTML == 0) {
                            sorot = elem[0];
                            sorot.classList.add("tersorot");
                        }
                        if (countIsi.innerHTML > 0) {
                            sorot = elem[--countIsi.innerHTML];
                            sorot.classList.add("tersorot");
                        }
                    }
                }
                
                // Enter
                if (e.keyCode == 13) {
                    let terpilih;
        
                    // Jika belum pernah search
                    if (kabkot.value == "") {
                        if (hitung.innerHTML == -1) {
                            swal.fire({
                                title: "Mohon Pilih Wilayah Terlebih Dahulu!",
                                icon: "error",
                            });
                        } else {
                            terpilih = elem[hitung.innerHTML];
                            updateName(terpilih);
                            filterBerita();
                        }
                        
                    } else {
                        // Sudah pernah search
                        // Jika panjang array == 1, langsung pilih elemen pertama
                        if (elem.length == 1) {
                            updateName(elem[0]);
                            filterBerita();
                        } else {
                            if (countIsi.innerHTML == -1) {
                                swal.fire({
                                    title: "Mohon Pilih Wilayah Terlebih Dahulu!",
                                    icon: "error",
                                });
                            } else {
                                terpilih = elem[countIsi.innerHTML];
                                updateName(terpilih);
                                filterBerita();
                            }
                            
                        }
                    }
        
                    if (options.innerHTML == `<p style="font-size: 12px;">Maaf, kabupaten/kota tidak ditemukan!</p>`) {
                        swal.fire({
                            title: "Mohon Maaf! Kabupaten/Kota Yang Anda Cari Tidak Tersedia!",
                            icon: "error"
                        });
                    }
                    
                    hitung.innerHTML = -1;
                    countIsi.innerHTML = -1;
                }
                
                // Backspace
                if (e.keyCode == 8) {
                    hitung.innerHTML = -1
                    countIsi.innerHTML = -1
                }
        });

        // Membuka dropdown wilayah jika diklik
        selectBtn.addEventListener("click", () => {
            wrapper.classList.toggle("active");
            kabkot.focus(); // Langsung fokus ngetik kabkot
        });

        // Klik di luar dropdown wilayah
        window.addEventListener('click', (e) => {
            if ((e.target != kabkot && e.target != pilihKota) && e.target != selectBtn) {
                wrapper.classList.remove("active");
                hitung.innerHTML = -1;
                countIsi.innerHTML = -1;
            }
        });



    } else {
        location.reload() // refresh page
    }
}


// Tab navigation horizontal scroll buttons
const btnLeft = document.querySelector(".left-btn");
const btnRight = document.querySelector(".right-btn");
const tabMenu = document.querySelector(".tab-menu");

const iconVisibility = () => {
    let scrollLeftValue = Math.ceil(tabMenu.scrollLeft);
    let scrollableWidth = tabMenu.scrollWidth - tabMenu.clientWidth;

    btnLeft.style.display = scrollLeftValue > 0 ? "block" : "none";
    btnRight.style.display = scrollableWidth > scrollLeftValue ? "block" : "none";
}

btnRight.addEventListener("click", () => {
    tabMenu.scrollLeft += 150;
    setTimeout(() => iconVisibility(), 50);
});
btnLeft.addEventListener("click", () => {
    tabMenu.scrollLeft -= 150;
    setTimeout(() => iconVisibility(), 50);
});

window.onload = function() {
    btnRight.style.display = tabMenu.scrollWidth > tabMenu.clientWidth || tabMenu.scrollWidth >= window.innerWidth ? "block" : "none";
    btnLeft.style.display = tabMenu.scrollWidth >= window.innerWidth ? "" : "none";
}
window.onresize = function() {
    btnRight.style.display = (tabMenu.scrollWidth > tabMenu.clientWidth) || (tabMenu.scrollWidth >= window.innerWidth) ? "block" : "none";
    btnLeft.style.display = tabMenu.scrollWidth >= window.innerWidth ? "" : "none";

    let scrollLeftValue = Math.round(tabMenu.scrollLeft);

    btnLeft.style.display = scrollLeftValue > 0 ? "block" : "none";
}

// Draggable navigation
let activeDrag = false;

tabMenu.addEventListener("mousemove", (drag) => {
    if(!activeDrag) return;
    tabMenu.scrollLeft -= drag.movementX;
    iconVisibility();
    tabMenu.classList.add("dragging");
});

document.addEventListener("mouseup", () => {
    activeDrag = false;
    tabMenu.classList.remove("dragging");
});

tabMenu.addEventListener("mousedown", () => {
    activeDrag = true;
});