class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_attached_file :avatar, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/assets/promoloyola81_logo_hat_red.png"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  scope :find_by_full_name_or_nickname, lambda { |query|
    query.downcase!
   (query ? where(["LOWER(nickname) ILIKE ? OR LOWER(first_name) ILIKE ? OR LOWER(last_name) ILIKE ? OR LOWER(middle_name) ILIKE ? OR LOWER(other_last_name) ILIKE ? OR CONCAT(LOWER(first_name), ' ', LOWER(middle_name), ' ', LOWER(last_name), ' ', LOWER(other_last_name)) ILIKE ? OR CONCAT(LOWER(first_name), ' ', LOWER(last_name), ' ', LOWER(other_last_name)) ILIKE ?", '%'+ query + '%', '%'+ query + '%', '%'+ query + '%', '%'+ query + '%', '%'+ query + '%','%'+ query + '%','%'+ query + '%' ])  : {})
  }


  def full_name
    full_name = ''
    full_name += "#{first_name} " unless first_name.nil?
    full_name += "#{middle_name} " unless middle_name.nil?
    full_name += "#{last_name} " unless last_name.nil?
    full_name += "#{other_last_name} " unless other_last_name.nil?
    full_name
  end

  def as_json(options={})
    super(options.merge({:methods => [:avatar, :full_name]}))
  end
end
