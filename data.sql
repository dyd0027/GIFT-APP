CREATE TABLE `user_m` (
	`login_id` VARCHAR(20) NOT NULL COLLATE 'utf8mb4_general_ci',
	`login_nm` VARCHAR(50) NOT NULL COLLATE 'utf8mb4_general_ci',
	`comp_nm` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`hq_nm` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`dept_nm` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`reg_dttm` DATETIME(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
	PRIMARY KEY (`login_id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `gift_m` (
	`seq` INT(11) NOT NULL AUTO_INCREMENT,
	`gift_nm` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_general_ci',
	`gift_date` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_general_ci',
	`gift_stdt` VARCHAR(14) NOT NULL COLLATE 'utf8mb4_general_ci',
	`gift_eddt` VARCHAR(14) NOT NULL COLLATE 'utf8mb4_general_ci',
	`notice` VARCHAR(5000) NOT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`seq`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;
CREATE TABLE `gift_sub` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`gift_seq` INT(11) NOT NULL,
	`detailNm` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci',
	`detail` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`imageFile` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`sub_sort` INT(11) NULL DEFAULT '0',
	`date_list` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`replace_ids` VARCHAR(500) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`add_detail` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `fk_gift_sub_gift_seq` (`gift_seq`) USING BTREE,
	CONSTRAINT `fk_gift_sub_gift_seq` FOREIGN KEY (`gift_seq`) REFERENCES `gift_m` (`seq`) ON UPDATE RESTRICT ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `delivery_addr_m` (
	`gift_seq` INT(11) NOT NULL DEFAULT '0',
	`emp_key_telno` VARCHAR(200) NOT NULL COLLATE 'utf8mb4_general_ci',
	`gift_sub_id` INT(11) NULL DEFAULT NULL,
	`emp_nm` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`emp_telno` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`emp_comp_nm` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`emp_hq_nm` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`emp_dept_nm` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`delevery_nm` VARCHAR(200) NOT NULL COLLATE 'utf8mb4_general_ci',
	`delevery_telno` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`delevery_postcode` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`delevery_addr` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`delevery_detail_addr` VARCHAR(400) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`reg_dttm` DATETIME(3) NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
	`upd_dttm` DATETIME(3) NULL DEFAULT NULL,
	`d_hope_dt` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`gift_seq`, `emp_key_telno`) USING BTREE,
	INDEX `idx_delivery_addr_product_sub_id` (`gift_sub_id`) USING BTREE,
	CONSTRAINT `fk_delivery_addr_gift_seq` FOREIGN KEY (`gift_seq`) REFERENCES `gift_m` (`seq`) ON UPDATE RESTRICT ON DELETE CASCADE,
	CONSTRAINT `fk_delivery_addr_gift_sub_id` FOREIGN KEY (`gift_sub_id`) REFERENCES `gift_sub` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;

CREATE TABLE `choice_store` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`gift_sub_id` INT(11) NOT NULL,
	`seq` INT(11) NULL DEFAULT NULL,
	`region` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`address` VARCHAR(1000) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`tel` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	PRIMARY KEY (`id`) USING BTREE,
	INDEX `fk_choice_store_product_sub_id` (`gift_sub_id`) USING BTREE,
	INDEX `idx_choice_store_prod_seq` (`gift_sub_id`, `seq`) USING BTREE,
	CONSTRAINT `fk_gift_sub_id` FOREIGN KEY (`gift_sub_id`) REFERENCES `gift_sub` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
;