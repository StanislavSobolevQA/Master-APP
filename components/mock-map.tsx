'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { X, MapPin } from 'lucide-react'

interface Request {
  id: string
  type: 'need' | 'offer'
  title: string
  category: string
  urgency: string
  reward: 'thanks' | 'money'
  amount?: number
  location: string
  district: string
  lat?: number
  lng?: number
  createdAt: Date
  description: string
}

interface MockMapProps {
  requests: Request[]
}

// Координаты для позиционирования маркеров на моковой карте (в процентах от размера)
const getMarkerPosition = (district: string, index: number): { top: string; left: string } => {
  const positions: Record<string, { top: string; left: string }[]> = {
    'Центральный': [
      { top: '45%', left: '50%' },
      { top: '48%', left: '52%' },
      { top: '42%', left: '48%' }
    ],
    'Северный': [
      { top: '30%', left: '50%' },
      { top: '28%', left: '52%' },
      { top: '32%', left: '48%' }
    ],
    'Южный': [
      { top: '70%', left: '50%' },
      { top: '72%', left: '52%' },
      { top: '68%', left: '48%' }
    ],
    'Восточный': [
      { top: '45%', left: '65%' },
      { top: '48%', left: '67%' },
      { top: '42%', left: '63%' }
    ],
    'Западный': [
      { top: '45%', left: '35%' },
      { top: '48%', left: '37%' },
      { top: '42%', left: '33%' }
    ]
  }
  
  const districtPositions = positions[district] || positions['Центральный']
  return districtPositions[index % districtPositions.length]
}

export function MockMap({ requests }: MockMapProps) {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [hoveredRequest, setHoveredRequest] = useState<string | null>(null)

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 relative bg-gradient-to-br from-slate-100 via-blue-50 to-green-50">
      {/* Фоновая карта (более детализированная) */}
      <div className="absolute inset-0 opacity-30">
        <svg viewBox="0 0 1000 700" className="w-full h-full">
          {/* Основные улицы (толстые) */}
          <path d="M 0 350 L 1000 350" stroke="#64748b" strokeWidth="4" fill="none" />
          <path d="M 500 0 L 500 700" stroke="#64748b" strokeWidth="4" fill="none" />
          <path d="M 250 0 L 250 700" stroke="#64748b" strokeWidth="3" fill="none" />
          <path d="M 750 0 L 750 700" stroke="#64748b" strokeWidth="3" fill="none" />
          <path d="M 0 175 L 1000 175" stroke="#64748b" strokeWidth="3" fill="none" />
          <path d="M 0 525 L 1000 525" stroke="#64748b" strokeWidth="3" fill="none" />
          
          {/* Второстепенные улицы */}
          <path d="M 125 0 L 125 700" stroke="#94a3b8" strokeWidth="2" fill="none" />
          <path d="M 375 0 L 375 700" stroke="#94a3b8" strokeWidth="2" fill="none" />
          <path d="M 625 0 L 625 700" stroke="#94a3b8" strokeWidth="2" fill="none" />
          <path d="M 875 0 L 875 700" stroke="#94a3b8" strokeWidth="2" fill="none" />
          <path d="M 0 87.5 L 1000 87.5" stroke="#94a3b8" strokeWidth="2" fill="none" />
          <path d="M 0 262.5 L 1000 262.5" stroke="#94a3b8" strokeWidth="2" fill="none" />
          <path d="M 0 437.5 L 1000 437.5" stroke="#94a3b8" strokeWidth="2" fill="none" />
          <path d="M 0 612.5 L 1000 612.5" stroke="#94a3b8" strokeWidth="2" fill="none" />
          
          {/* Диагональные улицы */}
          <path d="M 0 0 L 1000 700" stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M 1000 0 L 0 700" stroke="#cbd5e1" strokeWidth="1.5" fill="none" opacity="0.6" />
          
          {/* Кварталы/здания (блоки) */}
          <rect x="50" y="50" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="250" y="50" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="450" y="50" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="650" y="50" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="850" y="50" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          
          <rect x="50" y="200" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="250" y="200" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="450" y="200" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="650" y="200" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="850" y="200" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          
          <rect x="50" y="400" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="250" y="400" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="450" y="400" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="650" y="400" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="850" y="400" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          
          <rect x="50" y="550" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="250" y="550" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="450" y="550" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="650" y="550" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          <rect x="850" y="550" width="150" height="100" fill="#e2e8f0" opacity="0.4" rx="2" />
          
          {/* Парки/зеленые зоны */}
          <circle cx="200" cy="350" r="60" fill="#86efac" opacity="0.3" />
          <circle cx="800" cy="350" r="60" fill="#86efac" opacity="0.3" />
          <circle cx="500" cy="100" r="50" fill="#86efac" opacity="0.3" />
          <circle cx="500" cy="600" r="50" fill="#86efac" opacity="0.3" />
        </svg>
      </div>
      
      {/* Водяной знак карты */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-400 opacity-50 z-10">
        Схематическая карта
      </div>

      {/* Легенда */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-20">
        <div className="text-sm font-semibold mb-2">Легенда</div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-xs">Нужна помощь</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-xs">Могу помочь</span>
          </div>
        </div>
      </div>

      {/* Маркеры */}
      <div className="relative w-full h-[600px]">
        {requests.map((request, index) => {
          const position = getMarkerPosition(request.district, index)
          const isHovered = hoveredRequest === request.id
          const isSelected = selectedRequest?.id === request.id
          const color = request.type === 'need' ? 'bg-red-500' : 'bg-green-500'
          const hoverColor = request.type === 'need' ? 'bg-red-600' : 'bg-green-600'

          return (
            <div key={request.id} className="absolute z-10" style={position}>
              {/* Маркер */}
              <button
                onClick={() => setSelectedRequest(selectedRequest?.id === request.id ? null : request)}
                onMouseEnter={() => setHoveredRequest(request.id)}
                onMouseLeave={() => setHoveredRequest(null)}
                className={`
                  relative w-8 h-8 rounded-full ${color} ${isHovered || isSelected ? hoverColor : ''}
                  shadow-lg transform transition-all duration-200
                  ${isHovered || isSelected ? 'scale-125' : 'scale-100'}
                  hover:scale-125 cursor-pointer
                  flex items-center justify-center
                `}
              >
                <MapPin className="w-5 h-5 text-white" />
                
                {/* Пульсация при наведении */}
                {(isHovered || isSelected) && (
                  <div className={`absolute inset-0 rounded-full ${color} animate-ping opacity-75`}></div>
                )}
              </button>

              {/* Попап при клике */}
              {isSelected && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-30 animate-in fade-in slide-in-from-bottom-2">
                  <div className="p-4">
                    {/* Заголовок */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">{request.title}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedRequest(null)
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Бейджи */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{request.category}</Badge>
                      <Badge variant={request.urgency === 'today' ? 'destructive' : 'secondary'}>
                        {request.urgency === 'today' ? 'Сегодня' : 
                         request.urgency === 'tomorrow' ? 'Завтра' :
                         request.urgency === 'week' ? 'На неделе' : 'Не срочно'}
                      </Badge>
                      <Badge variant="default">
                        {request.reward === 'money' ? `${request.amount} ₽` : 'Спасибо'}
                      </Badge>
                    </div>

                    {/* Информация */}
                    <div className="space-y-2 mb-3 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-gray-700">{request.location}</div>
                          <div className="text-gray-500">{request.district}</div>
                        </div>
                      </div>
                      <div className="text-gray-600">{request.description}</div>
                    </div>

                    {/* Кнопка отклика */}
                    <button
                      onClick={() => {
                        alert(`Отклик на задачу: ${request.title}`)
                        setSelectedRequest(null)
                      }}
                      className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-medium"
                    >
                      Откликнуться
                    </button>
                  </div>

                  {/* Стрелка */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
                  </div>
                </div>
              )}

              {/* Подсказка при наведении */}
              {isHovered && !isSelected && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-20">
                  {request.title}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Информация о количестве задач */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg px-3 py-2 z-20">
        <div className="text-sm font-medium text-gray-700">
          Задач на карте: <span className="font-semibold">{requests.length}</span>
        </div>
      </div>
    </div>
  )
}

