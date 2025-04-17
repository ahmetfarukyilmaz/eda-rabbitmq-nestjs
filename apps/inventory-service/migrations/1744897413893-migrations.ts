import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744897413893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert dummy data into inventory table
    await queryRunner.query(`
            INSERT INTO inventory (product_name, quantity, price, created_at, updated_at)
            VALUES 
                ('Laptop', 25, 999.99, NOW(), NOW()),
                ('Smartphone', 50, 699.99, NOW(), NOW()),
                ('Headphones', 100, 149.99, NOW(), NOW()),
                ('Monitor', 30, 299.99, NOW(), NOW()),
                ('Keyboard', 45, 89.99, NOW(), NOW()),
                ('Mouse', 60, 49.99, NOW(), NOW()),
                ('Tablet', 35, 399.99, NOW(), NOW()),
                ('Printer', 20, 199.99, NOW(), NOW()),
                ('External Hard Drive', 40, 129.99, NOW(), NOW()),
                ('USB Flash Drive', 75, 19.99, NOW(), NOW())
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove inserted dummy data
    await queryRunner.query(`
            DELETE FROM inventory 
            WHERE product_name IN (
                'Laptop', 'Smartphone', 'Headphones', 'Monitor', 
                'Keyboard', 'Mouse', 'Tablet', 'Printer', 
                'External Hard Drive', 'USB Flash Drive'
            )
        `);
  }
}
