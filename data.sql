CREATE TABLE `user_m` (
  `LOGIN_ID` varchar(20) NOT NULL,
  `LOGIN_NM` varchar(50) NOT NULL,
  `COMP_NM` varchar(100) DEFAULT NULL,
  `HQ_NM` varchar(100) DEFAULT NULL,
  `DEPT_NM` varchar(100) DEFAULT NULL,
  `REG_DTTM` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  PRIMARY KEY (`LOGIN_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `product_m` (
  `SEQ` varchar(10) NOT NULL,
  `PRODUCT_NM` varchar(100) NOT NULL,
  `PRODUCT_STDT` varchar(14) NOT NULL,
  `PRODUCT_EDDT` varchar(14) NOT NULL,
  `DELIVERY_DT` varchar(5000) NOT NULL,
  `PROGRESS_YN` char(1) NOT NULL DEFAULT '',
  PRIMARY KEY (`SEQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE product_sub (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_seq VARCHAR(10) NOT NULL,
    detailNm VARCHAR(255) NOT NULL,
    detail TEXT,
    imageFile VARCHAR(500),
    sub_sort INT DEFAULT 0,
    CONSTRAINT fk_product_sub_product_seq FOREIGN KEY (product_seq)
        REFERENCES product_m(seq)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE product_sub ADD COLUMN `date_list` VARCHAR(100);
ALTER TABLE product_sub ADD COLUMN `repalce_id` INT;
ALTER TABLE product_sub ADD COLUMN `add_detail` TEXT;


CREATE TABLE `delivery_addr_m` (
  `PRODUCT_SEQ` varchar(20) NOT NULL,
  `EMP_KEY_TELNO` varchar(200) DEFAULT NULL,
  `PRODUCT_SUB_ID` INT,
  `EMP_NM` varchar(200) DEFAULT NULL,
  `EMP_TELNO` varchar(200) DEFAULT NULL,
  `EMP_COMP_NM` varchar(200) DEFAULT NULL,
  `EMP_HQ_NM` varchar(200) DEFAULT NULL,
  `EMP_DEPT_NM` varchar(200) DEFAULT NULL,
  `DELIVERY_NM` varchar(200) NOT NULL,
  `DELIVERY_TELNO` varchar(200) DEFAULT NULL,
  `DELIVERY_POSTCODE` varchar(200) DEFAULT NULL,
  `DELIVERY_ADDR` varchar(200) DEFAULT NULL,
  `DELIVERY_DETAIL_ADDR` varchar(400) DEFAULT NULL,
  `REG_DTTM` datetime(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
  `UPD_DTTM` datetime(3) DEFAULT NULL,
  `D_HOPE_DT` varchar(20) DEFAULT NULL,
  UNIQUE KEY `uq_delivery` (`PRODUCT_SEQ`,`EMP_KEY_TELNO`),
  CONSTRAINT fk_delivery_addr_product_seq FOREIGN KEY (PRODUCT_SEQ)
        REFERENCES product_m(SEQ)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_delivery_addr_product_sub_id FOREIGN KEY (product_sub_id)
        REFERENCES product_sub(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE choice_store (
    seq INT AUTO_INCREMENT PRIMARY KEY,
    product_sub_id INT,
    region VARCHAR(255) NOT NULL,
    address VARCHAR(1000),
    CONSTRAINT fk_product_sub_product_id FOREIGN KEY (product_sub_id)
        REFERENCES product_sub(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;