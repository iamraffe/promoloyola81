class AddAttributesToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :first_name, :string
    add_column :users, :middle_name, :string
    add_column :users, :last_name, :string
    add_column :users, :other_last_name, :string
    add_column :users, :phone_number, :string
    add_column :users, :nickname, :string
    add_column :users, :city, :string
    add_column :users, :country, :string
    add_column :users, :career, :string
    add_column :users, :job_position, :string
  end
end
