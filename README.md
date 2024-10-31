<h1 align="center">
  Hướng dẫn sử dụng
</h1>

## Database

Nằm trong folder `./sql`  
Database management systems: `PostgreSQL`  
Database name: `db_baemin`  
Mật khẩu và user của PostgreSQL có thể được cập nhật trong file `./back_end/.env.example`.

`postgres_db_baemin.sql`: file chứa định nghĩa table và column.  
`postgres_db_baemin_data.sql`: file chứa mock data.

```
NestJS cần có database để chạy.
Chạy toàn bộ script SQL trong 2 file trên để có database.
```

## Elasticsearch container

Cần phải có một container Elasticsearch để có thể chạy `Food Service`.  
Tên mặc định của Elasticsearch container là `elasticsearch`.  
Mật khẩu và user của Elasticsearch có thể được cập nhật trong file `./back_end/.env.example`.

## Docker Network

Network chung của database, front_end và back_end là:

```
node_network
```

## Build dự án bằng docker

```bash
# production
$ docker compose up -d
```

## Postman

File JSON của `Postman` nằm tại: `./postman/Homework_Microservice.postman_collection`.

Để khởi tạo data Food cho Elasticsearch có thể chạy API `Elasticsearch Populate` trong postman, hoặc chạy trực tiếp API `Elasticsearch Search Food`.

## Tài khoản mặc định

Tài khoản mặc định để đăng nhập và sử dụng các tính năng cần authen:

```
Email: khucthienphuc@gmail.com
Password: ktphuc1994
```

## Lưu ý

Khi vào `/dashboard` sẽ không có dữ liệu trong 60 giây đầu tiên.  
Sau 60 giây tải lại trang sẽ có dữ liệu.

### **Nguyên nhân:**

`DASHBOARD` là trang `ISR` (Incremental Static Regeneration), nên khi build sẽ yêu cầu fetch data từ phía backend để có dữ liệu tạo trang.

Nhưng Backend lại được build cùng lúc với Frontend, nên không thể truy cập backend. Dẫn đến không có dữ liệu.

Trang `DASHBOARD` được cài đặt sẽ fetch dữ liệu mới trong vòng 60 giây `(revalidate = 60)`, nên sẽ cập nhật dữ liệu sau mỗi 60 giây.
