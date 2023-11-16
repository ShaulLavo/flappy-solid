import { setStore, store } from '../store'

export function SettingsMenu({ isDisabled = false }) {
	return (
		<div class='w-full h-full flex flex-col justify-around'>
			<h2 class='text-2xl font-bold text-gray-300 text-center'>Settings</h2>
			<div class='flex items-center justify-center my-4'>
				<span class='text-gray-300 mr-4 font-semibold'>Web Worker:</span>
				<div
					class={
						'w-14 h-8 flex items-center rounded-full p-1' +
						(isDisabled ? 'cursor-not-allowed opacity-50 ' : 'cursor-pointer ') +
						(store.shouldUseWorker ? 'bg-blue-950' : 'bg-gray-800')
					}
					onClick={() => {
						if (!isDisabled) {
							setStore('shouldUseWorker', !store.shouldUseWorker)
						}
					}}>
					<div
						class={
							'bg-white w-6 h-6 rounded-full shadow-md transform transition-all ' +
							(store.shouldUseWorker ? 'translate-x-6' : '')
						}></div>
				</div>
			</div>
			<div class='flex items-center justify-center my-4'>
				<span class='text-gray-300 mr-4 font-semibold'>Speed: {store.speed}</span>
				<input
					type='range'
					min='0.1'
					max='5'
					step='0.1'
					value={store.speed}
					onInput={e => setStore('speed', e.currentTarget.valueAsNumber)}
					class='w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer thumb:bg-blue-600'
				/>
			</div>
		</div>
	)
}
