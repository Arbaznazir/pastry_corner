import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import CustomDatePicker from './CustomDatePicker'

interface CustomOrderModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CustomOrderModal({ isOpen, onClose }: CustomOrderModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Custom Cake',
    materials: '',
    details: '',
    date: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone || !formData.details) {
      alert('Please fill in your name, phone, and request details.')
      return
    }

    let formattedDate = 'Flexible'
    if (formData.date) {
      const [year, month, day] = formData.date.split('-')
      formattedDate = `${day}/${month}/${year}`
    }

    const message = `✨ CUSTOM ORDER INQUIRY ✨\n` +
      `Customer: ${formData.name}\n` +
      `Phone: ${formData.phone}\n\n` +
      `Request Type: ${formData.type}\n` +
      `Flavors / Materials: ${formData.materials || 'Not specified'}\n` +
      `Needed By: ${formattedDate}\n\n` +
      `Details:\n${formData.details}`

    const whatsappUrl = `https://wa.me/919596911102?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    // Clear form and close
    setFormData({
      name: '',
      phone: '',
      type: 'Custom Cake',
      materials: '',
      details: '',
      date: ''
    })
    onClose()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-zinc-950 border-l border-gold-500/40 shadow-2xl rounded-l-[2.5rem]">
                    <div className="flex-1 overflow-y-auto p-8 sm:p-14">
                      
                      <div className="flex items-start justify-between mb-12">
                        <div className="flex flex-col">
                          <span className="text-[9px] tracking-[0.4em] text-gold-600 uppercase font-light mb-4">Bespoke</span>
                          <Dialog.Title className="text-3xl font-serif text-white tracking-wide font-light">
                            Custom Order
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

                      <div className="mb-10 text-sm font-light text-zinc-400 leading-relaxed">
                        <p>Have a specific vision in mind? Let us craft a bespoke masterpiece tailored to your exact tastes, dietary needs, and theme.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <input
                              type="text"
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
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="block w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white focus:border-gold-500 focus:bg-black transition-colors placeholder:text-zinc-500"
                              placeholder="Phone Number *"
                            />
                          </div>
                        </div>

                        <div>
                          <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="block w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white focus:border-gold-500 focus:bg-black transition-colors"
                          >
                            <option value="Custom Cake">Custom Cake</option>
                            <option value="Custom Pastries">Custom Pastries</option>
                            <option value="Bulk Order / Event">Bulk Order / Event Catering</option>
                            <option value="Other">Other Bespoke Request</option>
                          </select>
                        </div>

                        <div>
                          <input
                            type="text"
                            name="materials"
                            value={formData.materials}
                            onChange={handleInputChange}
                            className="block w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white focus:border-gold-500 focus:bg-black transition-colors placeholder:text-zinc-500"
                            placeholder="Preferred Flavors, Ingredients or Dietary Needs (e.g. Eggless, Dark Choco)"
                          />
                        </div>

                        <div>
                          <textarea
                            name="details"
                            required
                            rows={4}
                            value={formData.details}
                            onChange={handleInputChange}
                            className="block w-full bg-zinc-900/50 border border-white/10 rounded-xl px-5 py-4 text-sm font-light text-white focus:border-gold-500 focus:bg-black transition-colors placeholder:text-zinc-500 resize-none"
                            placeholder="Describe your requirement in detail. Themes, designs, portions... *"
                          />
                        </div>

                        <div>
                          <CustomDatePicker
                            value={formData.date}
                            onChange={(date) => setFormData(prev => ({ ...prev, date }))}
                            minDate={new Date().toISOString().split('T')[0]}
                            placeholder="Needed By (Date)"
                          />
                        </div>

                        <div className="pt-6">
                          <button
                            type="submit"
                            className="w-full bg-gold-600 text-black text-[11px] tracking-[0.3em] font-medium uppercase py-5 rounded-full hover:bg-gold-500 hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-500"
                          >
                            Send Inquiry Via WhatsApp
                          </button>
                        </div>
                      </form>
                      
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
