'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, FileText, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { SafeRequest } from '@/lib/types'
// Простая функция форматирования даты без date-fns/locale
function formatDate(date: Date, formatStr: string): string {
  if (formatStr === 'd') {
    return date.getDate().toString()
  }
  return date.toLocaleDateString('ru-RU')
}

interface CalendarTabProps {
  requests: SafeRequest[]
  myOffers: any[]
  myRequests: SafeRequest[]
  offersOnMyRequests?: any[]
}

// Функция для получения задач на определенную дату и время
function getTasksForSlot(
  date: Date,
  timeSlot: string,
  requests: SafeRequest[],
  myOffers: any[],
  myRequests: SafeRequest[],
  offersOnMyRequests: any[] = []
) {
  const tasks: Array<{
    id: string
    title: string
    time: string
    assignee: string
    color: string
    type: 'request' | 'offer'
  }> = []

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const slotHour = parseInt(timeSlot.split(':')[0])
  
  // Задачи из моих запросов
  myRequests.forEach(req => {
    const reqDate = new Date(req.created_at)
    const reqDateStr = `${reqDate.getFullYear()}-${String(reqDate.getMonth() + 1).padStart(2, '0')}-${String(reqDate.getDate()).padStart(2, '0')}`
    
    if (reqDateStr === dateStr) {
      // Определяем время на основе времени создания
      const createdTime = reqDate.getHours()
      const createdMinute = reqDate.getMinutes()
      
      // Проверяем, попадает ли задача в этот временной слот
      if (createdTime >= slotHour && createdTime < slotHour + 2) {
        const startHour = slotHour
        const endHour = Math.min(slotHour + 2, 24)
        const timeRange = `${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:00`
        
        // Находим исполнителя из откликов на этот запрос
        const offer = offersOnMyRequests.find((o: any) => {
          const requestId = o.requests?.id || o.request_id
          return requestId === req.id
        })
        const assignee = offer?.profiles?.display_name || 'Исполнитель'
        
        tasks.push({
          id: req.id,
          title: req.title,
          time: timeRange,
          assignee: assignee,
          color: 'green', // Зеленый для моих запросов
          type: 'request'
        })
      }
    }
  })

  // Задачи из моих откликов
  myOffers.forEach((offer: any) => {
    const request = offer.requests
    if (!request) return
    
    const reqDate = new Date(request.created_at)
    const reqDateStr = `${reqDate.getFullYear()}-${String(reqDate.getMonth() + 1).padStart(2, '0')}-${String(reqDate.getDate()).padStart(2, '0')}`
    
    if (reqDateStr === dateStr) {
      const createdTime = reqDate.getHours()
      
      // Проверяем, попадает ли задача в этот временной слот
      if (createdTime >= slotHour && createdTime < slotHour + 2) {
        const startHour = slotHour
        const endHour = Math.min(slotHour + 2, 24)
        const timeRange = `${String(startHour).padStart(2, '0')}:00 - ${String(endHour).padStart(2, '0')}:00`
        
        tasks.push({
          id: offer.id,
          title: request.title,
          time: timeRange,
          assignee: offer.profiles?.display_name || 'Я',
          color: 'blue', // Синий для моих откликов
          type: 'offer'
        })
      }
    }
  })

  return tasks
}


export function CalendarTab({ requests, myOffers, myRequests, offersOnMyRequests = [] }: CalendarTabProps) {
  const router = useRouter()
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Получаем начало недели (понедельник)
  const getWeekStart = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Понедельник
    return new Date(d.setDate(diff))
  }

  const weekStart = getWeekStart(currentWeek)
  
  // Генерируем дни недели
  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      days.push(date)
    }
    return days
  }, [weekStart])

  // Временные слоты
  const timeSlots = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']

  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeek(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeek(newDate)
  }

  const goToToday = () => {
    setCurrentWeek(new Date())
  }

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Календарь</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            ←
          </Button>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Сегодня
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            →
          </Button>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex gap-3 mb-6">
        <Button
          onClick={() => router.push('/dashboard/create')}
          className="bg-green-500 hover:bg-green-600 text-white flex-1"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить задачу
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/templates')}
          className="flex-1"
        >
          <FileText className="h-4 w-4 mr-2" />
          Шаблоны задач
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="flex-1"
        >
          <Search className="h-4 w-4 mr-2" />
          Найти исполнителя
        </Button>
      </div>

      {/* Календарь */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200 min-w-[100px]">
                  Время
                </th>
                {weekDays.map((day, index) => (
                  <th key={index} className="p-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0 min-w-[150px]">
                    <div>{dayNames[index]}</div>
                    <div className="text-xs font-normal text-gray-500 mt-1">
                      {formatDate(day, 'd')}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot, slotIndex) => (
                <tr key={timeSlot} className="border-b border-gray-200 last:border-b-0">
                  <td className="p-3 text-sm text-gray-600 border-r border-gray-200 bg-gray-50">
                    {timeSlot}
                  </td>
                  {weekDays.map((day, dayIndex) => {
                    const tasks = getTasksForSlot(day, timeSlot, requests, myOffers, myRequests, offersOnMyRequests)
                    return (
                      <td
                        key={dayIndex}
                        className="p-2 border-r border-gray-200 last:border-r-0 align-top"
                      >
                        <div className="space-y-2 min-h-[80px]">
                          {tasks.map((task) => (
                            <div
                              key={task.id}
                              className={`rounded-lg p-2 text-xs cursor-pointer hover:shadow-md transition-all ${
                                task.color === 'green'
                                  ? 'bg-green-50 border-l-4 border-green-500'
                                  : task.color === 'blue'
                                  ? 'bg-blue-50 border-l-4 border-blue-500'
                                  : 'bg-gray-50 border-l-4 border-gray-400'
                              }`}
                              onClick={() => router.push(`/requests/${task.id}`)}
                            >
                              <div className="font-medium text-gray-900 mb-1">
                                {task.time}
                              </div>
                              <div className="text-gray-700 mb-1 line-clamp-2">
                                {task.title}
                              </div>
                              <div className="flex items-center gap-1 text-gray-600">
                                <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                                <span className="text-xs">{task.assignee}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

