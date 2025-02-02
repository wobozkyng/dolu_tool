import { ActionIcon, Group, Paper, Select, Space, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { interiorAtom, timecycleListAtom } from '../../../../../atoms/interior'
import { fetchNui } from '../../../../../utils/fetchNui'
import { useLocales } from '../../../../../providers/LocaleProvider'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useNuiEvent } from '../../../../../hooks/useNuiEvent'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

const RoomsElement: React.FC = () => {
    const { locale } = useLocales()
    const interior = useRecoilValue(interiorAtom)
    const [timecycleList, setTimecycleList] = useRecoilState(timecycleListAtom)
    const [timecycle, setTimecycle] = useState<string | null>(interior.currentRoom?.timecycle ? interior.currentRoom?.timecycle.toString() : null)

    useNuiEvent('setTimecycleList', (data: Array<{ label: string, value: string }>) => {
        setTimecycleList(data)
    })

    useNuiEvent('setIntData', (data: any) => {
        if (data.currentRoom !== undefined) setTimecycle(data.currentRoom.timecycle)
    })

    const handlePrevClick = () => {
        const currentIndex = timecycleList.findIndex((option) => option.value === timecycle)
        const prevIndex = currentIndex === 0 ? timecycleList.length - 1 : currentIndex - 1
        setTimecycle(timecycleList[prevIndex].value)
    }

    const handleNextClick = () => {
        const currentIndex = timecycleList.findIndex((option) => option.value === timecycle)
        const nextIndex = (currentIndex + 1) % timecycleList.length
        setTimecycle(timecycleList[nextIndex].value)
    }

    useEffect(() => {
        if (timecycle!) fetchNui('dolu_tool:setTimecycle', { value: timecycle, roomId: interior.currentRoom?.index })
    }, [timecycle])

    return (
        <Paper p='md'>
            <Text size={24} weight={600}>{locale.ui_current_room}</Text>
            <Space h='xs' />
            <Paper p='md'>
                <Group><Text>{locale.ui_index}:</Text><Text color='blue.4' > {interior.currentRoom?.index}</Text></Group>
                <Group><Text>{locale.ui_name}:</Text><Text color='blue.4' > {interior.currentRoom?.name}</Text></Group>
                <Group><Text>{locale.ui_flag}:</Text><Text color='blue.4' > {interior.currentRoom?.flags.total}</Text></Group>
                <Group>
                    <Text>{locale.ui_timecycle}:</Text>
                    <Group spacing={5}>
                        {timecycle &&
                            <Select
                                searchable
                                nothingFound={locale.ui_no_timecycle_found}
                                data={timecycleList}
                                value={timecycle}
                                onChange={(value) => setTimecycle(value)}
                                width={170}
                            />
                        }
                        <ActionIcon size={36} variant='default' onClick={() => { handlePrevClick() }}>
                            <FaArrowLeft />
                        </ActionIcon>
                        <ActionIcon size={36} variant='default' onClick={() => { handleNextClick() }}>
                            <FaArrowRight />
                        </ActionIcon>
                    </Group>
                </Group>
            </Paper>
        </Paper>
    )
}

export default RoomsElement