import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface RecentOrdersProps {
  isOpen: boolean
  onClose: () => void
  orders: any[]
}

export default function RecentOrders({ isOpen, onClose, orders }: RecentOrdersProps) {
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-zinc-950 border-l border-gold-500/40 shadow-2xl rounded-l-[2.5rem]">
                    <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12 sm:py-12">
                      <div className="flex items-start justify-between mb-12">
                        <Dialog.Title className="text-2xl font-serif text-white uppercase font-light tracking-widest">
                          Recent Orders
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative -m-2 p-2 text-zinc-500 hover:text-gold-600 transition-colors rounded-full"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6 stroke-[1]" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          {orders.length === 0 ? (
                            <p className="text-center text-zinc-500 font-sans tracking-widest text-xs uppercase mt-20">
                              No recent orders found.
                            </p>
                          ) : (
                            <ul role="list" className="-my-8 divide-y divide-white/10">
                              {orders.map((order, idx) => (
                                <li key={idx} className="py-8">
                                  <div className="flex justify-between items-center mb-4">
                                    <span className="text-gold-500 font-sans text-[10px] tracking-widest uppercase">
                                      Order #{order.id || Math.floor(Math.random() * 900000)}
                                    </span>
                                    <span className="text-zinc-500 text-[10px] tracking-widest">
                                      {new Date(order.timestamp).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <ul className="space-y-3 mb-6">
                                    {order.items.map((item: any, i: number) => (
                                      <li key={i} className="flex justify-between text-xs text-zinc-300 font-light">
                                        <span>{item.quantity} × {item.name}</span>
                                        <span>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                    <span className="text-xs text-white tracking-widest font-light uppercase">Total</span>
                                    <span className="text-sm font-serif text-gold-600">Rs. {order.total.toFixed(2)}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
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
