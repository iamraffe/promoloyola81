Rails.application.routes.draw do
  devise_for :users
  root 'pages#app'
  get 'dashboard', to: 'pages#app', as: 'dashboard'
  get 'users/find', to: 'users#find'
  resources :users, only: [:index]
end
