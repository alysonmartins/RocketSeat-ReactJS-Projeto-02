import { HandPalm, Play } from "phosphor-react";
import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from "./styles";

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from "zod"
import { createContext, useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { Countdown } from "./components/CountDown";
import { NewCycleForm } from "./components/NewCycleForm";


interface Cycle {
	id: string
	task: string
	minutesAmount: number
	startDate: Date
	interruptedDate?: Date
	finishedDate?: Date
}

interface CycleContextType {
	activeCycle: Cycle | undefined;
}

export const CyclesContext = createContext({} as CycleContextType)


export function Home() {
	const [cycles, setCycles] = useState<Cycle[]>([])
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

	const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)





	const uuid = self.crypto.randomUUID();

	function handleCreateNewCycle(data: NewCycleFormData) {

		const newCycle: Cycle = {
			id: uuid,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		}


		setCycles((state) => [...state, newCycle])
		setActiveCycleId(newCycle.id)
		setAmountSecondsPassed(0)

		reset();
	}

	function handleInterruptCycle() {
		setCycles((state) =>
			state.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, interruptedDate: new Date() }
				} else {
					return cycle
				}
			}),
		)
		setActiveCycleId(null)
	}

	const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

	const minutesAmount = Math.floor(currentSeconds / 60)
	const secondsAmount = currentSeconds % 60

	const minutes = String(minutesAmount).padStart(2, '0')
	const seconds = String(secondsAmount).padStart(2, '0')

	useEffect(() => {
		if (activeCycle) {
			document.title = `${minutes}: ${seconds}`
		}
	}, [minutes, seconds, activeCycle])

	const task = watch('task')
	const isSubmitDisabled = !task



	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
				<CyclesContext.Provider value={{ activeCycle }}>
					<NewCycleForm />
					<Countdown />
				</CyclesContext.Provider>

				{activeCycle ? (
					<StopCountdownButton onClick={handleInterruptCycle} type="button">
						<HandPalm size={24} />
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton disabled={isSubmitDisabled} type="submit">
						<Play size={24} />
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	)
}