CREATE TABLE customer_contacts (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `customer_id` BIGINT,
    `type` ENUM('whatsapp', 'instagram', 'facebook') NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
);