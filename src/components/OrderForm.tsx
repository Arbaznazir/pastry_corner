import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { CartItem } from '../types'

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  total: number
  onPlaceOrder: (order: any) => void
}

export default function OrderForm({ isOpen, onClose, cart, total, onPlaceOrder }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !formData.address) {
      alert('Please fill in all required fields')
      return
    }

    const orderItems = cart.map(item => 
      `• ${item.name} x${item.quantity} - Rs. ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')
    
    const orderRef = Math.floor(100000 + Math.random() * 900000);
    const message = `✨ NEW ORDER - PASTRY CORNER ✨\n` +
      `Order Ref: #${orderRef}\n\n` +
      `Customer: ${formData.name}\n` +
      `Phone: ${formData.phone}\n` +
      `Address: ${formData.address}\n\n` +
      `Order Details:\n${orderItems}\n\n` +
      `Total: Rs. ${total.toFixed(2)}\n\n` +
      (formData.notes ? `Special Notes: ${formData.notes}\n` : '')

    const whatsappUrl = `https://wa.me/919596911102?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    // Log the order and clear the cart!
    onPlaceOrder({
      id: orderRef.toString(),
      items: cart,
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        notes: formData.notes
      },
      total: total,
      timestamp: new Date()
    })

    onClose()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-700 sm:duration-[800ms]"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-700 sm:duration-[800ms]"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-zinc-950 border-l border-gold-500/40 shadow-2xl rounded-l-[2.5rem]">
                    <div className="flex-1 overflow-y-auto p-8 sm:p-14">
                      <div className="flex items-start justify-between mb-16">
                        <div className="flex flex-col">
                          <span className="text-[9px] tracking-[0.4em] text-gold-600 uppercase font-light mb-4">Final Step</span>
                          <Dialog.Title className="text-4xl font-serif text-white tracking-wide font-light">
                            Checkout
                          </Dialog.Title>
                        </div>
                        <div className="ml-3 flex h-7 items-center mt-2">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-zinc-500 hover:text-gold-600 transition-colors"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6 stroke-[1]" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col md:flex-row gap-16">
                        {/* Order Summary */}
                        <div className="md:w-1/3 order-2 md:order-1">
                          <h4 className="text-xs font-sans tracking-[0.3em] text-gold-600 uppercase mb-8 pb-4 border-b border-white/10">Summary</h4>
                          <div className="space-y-6">
                            <ul className="space-y-4">
                              {cart.map((item) => (
                                <li key={item.id} className="flex justify-between text-xs font-sans font-light text-zinc-300">
                                  <span className="flex-1 pr-4">{item.quantity} × {item.name}</span>
                                  <span className="text-gold-600">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="pt-6 border-t border-white/10 flex justify-between items-center text-sm font-serif text-white font-medium">
                              <span>Total</span>
                              <span className="text-gold-600">Rs. {total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Booking Form */}
                        <div className="md:w-2/3 order-1 md:order-2">
                          <h4 className="text-xs font-sans tracking-[0.3em] text-gold-600 uppercase mb-8 pb-4 border-b border-white/10">Details</h4>
                          <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 gap-6">
                              <div>
                                <input
                                  type="text"
                                  id="name"
                                  name="name"
                                  required
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  className="block w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white focus:border-gold-500 focus:bg-black transition-colors placeholder:text-zinc-500"
                                  placeholder="Full Name *"
                                />
                              </div>

                              <div>
                                <input
                                  type="tel"
                                  id="phone"
                                  name="phone"
                                  required
                                  value={formData.phone}
                                  onChange={handleInputChange}
                                  className="block w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white focus:border-gold-500 focus:bg-black transition-colors placeholder:text-zinc-500"
                                  placeholder="Phone Number *"
                                />
                              </div>

                              <div>
                                <input
                                  type="text"
                                  id="address"
                                  name="address"
                                  required
                                  value={formData.address}
                                  onChange={handleInputChange}
                                  className="block w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white focus:border-gold-500 focus:bg-black transition-colors placeholder:text-zinc-500"
                                  placeholder="Delivery Address *"
                                />
                              </div>

                              <div>
                                <input
                                  type="email"
                                  id="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  className="block w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white focus:border-gold-500 focus:bg-black transition-colors placeholder:text-zinc-500"
                                  placeholder="Email Address (Optional)"
                                />
                              </div>

                              <div>
                                <textarea
                                  id="notes"
                                  name="notes"
                                  rows={3}
                                  value={formData.notes}
                                  onChange={handleInputChange}
                                  className="block w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white focus:border-gold-500 focus:bg-black transition-colors placeholder:text-zinc-500 resize-none mt-2"
                                  placeholder="Any special requests or delivery instructions..."
                                />
                              </div>
                            </div>
                            
                            <div className="pt-8">
                              <button
                                type="submit"
                                className="w-full bg-gold-600 text-black text-[11px] tracking-[0.3em] font-medium uppercase py-5 rounded-full hover:bg-gold-500 hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-500"
                              >
                                Place Order
                              </button>
                              <p className="text-center text-zinc-500 font-light text-[10px] tracking-wide mt-6 uppercase">
                                Redirects to WhatsApp for final confirmation.
                              </p>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}