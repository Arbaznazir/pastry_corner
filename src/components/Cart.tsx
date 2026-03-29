import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline'
import type { CartItem } from '../types'

interface CartProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  total: number
  onCheckout: () => void
}

export default function Cart({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  total,
  onCheckout,
}: CartProps) {
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-lg">
                  <div className="flex h-full flex-col overflow-y-scroll bg-zinc-950 border-l border-gold-500/40 shadow-2xl rounded-l-[2.5rem]">
                    <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12 sm:py-12">
                      <div className="flex items-start justify-between mb-12">
                        <Dialog.Title className="text-2xl font-serif text-white uppercase font-light tracking-widest">
                          Your Cart
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
                          {cart.length === 0 ? (
                            <p className="text-center text-zinc-400 font-serif italic text-lg opacity-60">
                              Your cart is empty.
                            </p>
                          ) : (
                            <ul
                              role="list"
                              className="-my-8 divide-y divide-white/10"
                            >
                              {cart.map((item) => (
                                <li key={item.id} className="flex py-8">
                                  <div className="h-32 w-24 flex-shrink-0 overflow-hidden bg-zinc-900 rounded-[1.5rem]">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="h-full w-full object-cover object-center"
                                    />
                                  </div>

                                  <div className="ml-6 flex flex-1 flex-col justify-center">
                                    <div>
                                      <div className="flex justify-between text-base font-serif text-white mb-2">
                                        <h3 className="font-light text-lg tracking-wide">{item.name}</h3>
                                      </div>
                                      <p className="text-[10px] tracking-[0.2em] text-gold-600 uppercase">
                                        Rs. {(item.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm mt-6">
                                      <div className="flex items-center gap-4 bg-black rounded-full px-2 py-1 hairline-border">
                                        <button
                                          onClick={() =>
                                            onUpdateQuantity(
                                              item.id,
                                              item.quantity - 1,
                                            )
                                          }
                                          className="text-zinc-400 hover:text-gold-600 transition-colors px-2 rounded-full hover:bg-zinc-950 h-6 w-6 flex items-center justify-center p-0"
                                        >
                                          <MinusIcon className="w-3 h-3 stroke-[1.5]" />
                                        </button>
                                        <span className="font-sans text-xs text-white w-4 text-center">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() =>
                                            onUpdateQuantity(
                                              item.id,
                                              item.quantity + 1,
                                            )
                                          }
                                          className="text-zinc-400 hover:text-gold-600 transition-colors px-2 rounded-full hover:bg-zinc-950 h-6 w-6 flex items-center justify-center p-0"
                                        >
                                          <PlusIcon className="w-3 h-3 stroke-[1.5]" />
                                        </button>
                                      </div>
                                      <button
                                        onClick={() =>
                                          onUpdateQuantity(item.id, 0)
                                        }
                                        type="button"
                                        className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 hover:text-white transition-colors"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {cart.length > 0 && (
                      <div className="px-8 py-10 sm:px-12 bg-black border-t border-white/10">
                        <div className="flex justify-between text-xl font-serif text-white font-light mb-4">
                          <p>Total</p>
                          <p className="text-gold-600">Rs. {total.toFixed(2)}</p>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-light tracking-wide mb-10 uppercase">
                          Taxes and delivery calculated at checkout.
                        </p>
                        <div className="mt-6">
                          <button
                            onClick={onCheckout}
                            className="w-full bg-gold-600 text-black text-[11px] tracking-[0.3em] font-medium uppercase py-5 rounded-full hover:bg-gold-500 hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all duration-500"
                          >
                            Checkout
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center">
                          <button
                            type="button"
                            className="text-[10px] font-light text-zinc-400 hover:text-white tracking-[0.2em] uppercase transition-colors"
                            onClick={onClose}
                          >
                            Continue Browsing
                          </button>
                        </div>
                      </div>
                    )}
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
