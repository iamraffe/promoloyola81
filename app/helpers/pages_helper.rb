module PagesHelper
  def logo_helper
    colors = [
      'orange',
      'red',
      'blue',
      'green',
      'pink',
      'yellow'
    ]

    image_tag("promoloyola81_logo_hat_#{colors.sample}.png", class: "sign-in-logo js-sign-in-logo", alt: "Promo 81")
  end
end
