library(rvest)
library(xml2)
library(stringr)
library(dplyr)

laman <- read_html("https://jatim.bps.go.id/indicator/3/1/1/inflasi-bulanan-m-to-m-.html")

bulan <- seq(as.Date("2023-05-01"), as.Date("2024-05-01"), by = "1 month")
inflasi2324 = c()
for (i in 3:4) {
   inflasi <- laman %>% html_nodes(paste0('#tablex td:nth-child(',i,')')) %>% html_text()
   inflasi2324 = c(inflasi2324, inflasi)
}

# Ambil mulai Mei 2023 - Apr 2024
inflasi2324 <- gsub(",", ".", inflasi2324[5:16]) %>% as.numeric()
# Masukkan ke data frame
infbps <- data.frame(bulan = bulan[1:12], inflasi = inflasi2324)


###### MEMPERBARUI DATA HARGA BULANAN #################
library(jsonlite)

# step 1: Read the whole html
html <- read_html("https://siskaperbapo.jatimprov.go.id/tren")

# step 2: get the list of commodities
id <- html %>%
  html_elements(xpath='//*[@id="komoditas"]/option') %>%
  html_attr("value")  %>%
  str_trim()    # library(stringr)

label <- html %>%
  html_elements(xpath='//*[@name="komoditas"]/option') %>%
  html_text() %>%
  str_trim()

# commodities <- as.data.frame(list(idkom=idkom, label=idlabel))
commodities <- data.frame(id = id, label = label)

# melakukan perulangan masing-masing baris sebanyak 30 kali
comm_rep <- commodities[rep(seq_len(nrow(commodities)), each = 13), ]

#Membuat link JSON
link <- data.frame()
for(hasil in as.numeric(commodities$id)){
  x <- paste0("https://siskaperbapo.jatimprov.go.id/tren/hargabulanan/?komoditas=",hasil)
  link <- rbind(link, data.frame(x))
}

dptdata <- function(x){
  x <- fromJSON(x)
  return(x)
}
gabung <- data.frame(commodities, link)
data <- sapply(gabung$x, FUN = dptdata, USE.NAMES = F)

datamu <- data.frame()
for(i in seq(2, 134, 2)){
  dataku <- data[i][1] %>% unlist() %>% as.data.frame() %>% na.omit()
  datamu <- rbind(datamu, data.frame(dataku))
}

# mengubah dataframe menjadi dua kolom
tgl <- datamu[seq(1, nrow(datamu), 2), ]  # baris ganjil
hrg <- datamu[seq(2, nrow(datamu), 2), ]  # baris genap
df <- data.frame(tgl = tgl, hrg = hrg)  # menggabungkan kedua kolom

#penggabungan data harian selama 30 harian
bulanan <- data.frame(id = comm_rep$id, label = comm_rep$label, tgl = df$tgl, hrg = df$hrg)

#mengubah tipe variabel hrg dari char ke numeric
bulanan$hrg <- as.numeric(bulanan$hrg)

#mengubah tipe variabel tgl dari char ke type date
bulanan$tgl <- as.Date(paste(bulanan$tgl, "-01", sep = ""), format = "%Y-%m-%d")

# Mengelompokkan data berdasarkan label
bulanan <- bulanan %>%
  arrange(label, tgl) %>%
  group_by(label) %>%
  mutate(
    pct_change = (hrg - lag(hrg, default = first(hrg))) / lag(hrg, default = first(hrg)) * 100
  ) %>%
  ungroup()

# Menghapus perubahan pertama kali
bulanan <- bulanan %>%
  filter(pct_change != 0)
library(tidyr)

# Pivot Wider
bulanan2 <- bulanan %>%
 select(tgl, label, pct_change) %>%
  pivot_wider(names_from = label, values_from = pct_change)

# manipulasi
bulanan3 <- bulanan2

# mengubah nama kolom
n <- 67
colnames(bulanan3) <- c("tgl", paste0("v", 1:n))

# menghapus kolom yang barisnya mengandung "NA"
# Menentukan kolom yang mengandung nilai NA
kolom_dengan_na <- colSums(is.na(bulanan3)) > 0

# Menghapus kolom dengan nilai NA
bulanan3 <- bulanan3[, !kolom_dengan_na]

# menyatukan data inflasi BPS dengan bulanan3
siap <- cbind(bulanan3[-12,-1], inflasi = infbps$inflasi[-1])

attach(siap)
names(siap)

# korelasi
# Hitung korelasi antar variabel
cor_matrix <- cor(siap)
cor_with_inflasi = c()

# Urutkan korelasi terhadap variabel inflasi
for (i in 1:63) {
   cor_with_inflasi = c(cor_with_inflasi, cor_matrix[63,i])
}

sorted_cor <- sort(abs(cor_with_inflasi), decreasing = TRUE)

# Pilih 3 variabel dengan korelasi tertinggi
top_3_variables <- names(sorted_cor)[2:11]
top_3_variables

# Tampilkan nilai korelasi untuk ketiga variabel tertinggi
for (variable in top_3_variables) {
  correlation_value <- cor(siap$inflasi, siap[[variable]])
  cat(paste("Korelasi antara", variable, "dan inflasi:", correlation_value, "\n"))
}

# Nama variabel baru yang ingin dideteksi
nmvar <- c("v65", "v51", "v32", "v47", "v9", "v7", "v61", "v31", "v21", "v19", "v8", "54",
           "v17", "v38")

# Loop untuk setiap variabel baru
for (i in nmvar) {
  # Cari indeks variabel baru di data frame baru
  index <- grep(i, names(siap))
 
  # Dapatkan nama variabel asli dari data frame awal
  orivar <- names(bulanan2)[index]
 
  # Tampilkan hasil
  if (!is.null(orivar)) {
    cat("Variabel asli dari", i, "adalah:", orivar, "\n")
  } else {
    cat("Variabel asli", i, "tidak ditemukan dalam data frame.\n")
  }
}

# model regresi
modinter <- lm(inflasi.2.12.~1)
mod_all <- lm(inflasi.2.12.~., data = siap)
modstep <- step(modinter, direction = "both", scope = formula(mod_all), trace = T)

mod <- lm(inflasi.2.12. ~ v65+v8+v51+v54+v17+v38)
summary(mod)

# uji asumsi
library(lmtest)
library(nortest)
library(olsrr)
lillie.test(mod$residuals)
bptest(mod)
dwtest(mod)
ols_vif_tol(mod)

gabung <- bulanan %>%
  filter(label == "Telur Ayam Kampung / kg" |
           label == "Besi Beton 6 mm (12/9m) / Btg" |
           label == "Pupuk NPK Non Subsidi / Kg" |
           label == "Pupuk ZA Non Subsidi / Kg" |
           label == "Garam Beryodium  Bata / buah" |
           label == "Minyak Goreng Curah / kg"
           
           )

# mengalikan masing-masing koefisien regresi
gabung <- gabung %>%
  mutate(
    inf = case_when(
      label == "Telur Ayam Kampung / kg" ~ pct_change * mod$coefficients[2],
      label == "Besi Beton 6 mm (12/9m) / Btg" ~ pct_change * mod$coefficients[3],
      label == "Pupuk NPK Non Subsidi / Kg" ~ pct_change * mod$coefficients[4],
      label == "Pupuk ZA Non Subsidi / Kg" ~ pct_change * mod$coefficients[5],
      label == "Garam Beryodium  Bata / buah" ~ pct_change * mod$coefficients[6],
      label == "Minyak Goreng Curah / kg" ~ pct_change * mod$coefficients[7],
      TRUE ~ pct_change
    ) + (mod$coefficients[1]/6)
  )


# Import data yang ada sebelumnya di Google Sheet
library(googlesheets4)
sheetku1 <- gs4_get("https://docs.google.com/spreadsheets/d/14haWg5_1DVkzqCMUd04pOwgSRn5-9CaSO49hdi0Gf8Q/edit?usp=sharing")
sebelum <- read_sheet(sheetku1, sheet = "Sheet1")

# melakukan penggabungan
library(dplyr)
gabung <- union(gabung, sebelum)

#menghapus duplikasi tanggal yang sama
gabung <- gabung %>%
  distinct(id, label, tgl, .keep_all = TRUE)

# Mengupdate data yang ada dengan data terbaru
write_sheet(gabung, sheetku1, sheet = "Sheet1")

write.xlsx(gabung, "terbaru2024.xlsx")

plot(inflasi.2.12., type = "l")




