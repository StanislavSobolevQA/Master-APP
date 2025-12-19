'use client'

import { Home, Hammer, Package, Dog } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/constants'
import { CATEGORIES } from '@/lib/constants'

interface CategoryTilesProps {
  selectedCategory?: string
  onCategorySelect?: (category: string) => void
  showAll?: boolean
  className?: string
}

const categoryConfig: Record<Category, {
  label: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  ringColor: string
  dotColor: string
}> = {
  'уборка': {
    label: 'Уборка',
    icon: Home,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    ringColor: 'ring-blue-600',
    dotColor: 'bg-blue-600',
  },
  'ремонт': {
    label: 'Ремонт',
    icon: Hammer,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-50',
    ringColor: 'ring-orange-600',
    dotColor: 'bg-orange-600',
  },
  'доставка': {
    label: 'Доставка',
    icon: Package,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50',
    ringColor: 'ring-green-600',
    dotColor: 'bg-green-600',
  },
  'выгул': {
    label: 'Выгул животных',
    icon: Dog,
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-50',
    ringColor: 'ring-pink-600',
    dotColor: 'bg-pink-600',
  },
}

const categories = CATEGORIES

export function CategoryTiles({ selectedCategory, onCategorySelect, showAll = false, className }: CategoryTilesProps) {
  const handleClick = (category: string) => {
    if (!onCategorySelect) return

    // Если категория уже выбрана, снимаем выбор (если showAll=true, возвращаем "Все категории", иначе "all")
    if (selectedCategory === category) {
      onCategorySelect(showAll ? 'Все категории' : 'all')
    } else {
      // Выбираем новую категорию
      onCategorySelect(category)
    }
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-6', className)}>
      {categories.map((category) => {
        const config = categoryConfig[category]
        const Icon = config.icon
        const isSelected = selectedCategory === category

        return (
          <button
            key={category}
            onClick={() => handleClick(category)}
            aria-label={`Выбрать категорию ${config.label}`}
            aria-pressed={isSelected}
            className={cn(
              'group relative flex flex-col items-center justify-center',
              'bg-gray-50 rounded-2xl p-8',
              'transition-all duration-500 ease-out',
              'transform-gpu',
              // Эффект парения
              'hover:-translate-y-3 hover:shadow-2xl',
              isSelected && '-translate-y-2 shadow-xl',
              // Состояние выбора
              isSelected && 'ring-2 ring-offset-2 ring-offset-gray-50',
              isSelected && config.ringColor
            )}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
            }}
          >
            {/* 3D иконка */}
            <div
              className={cn(
                'relative mb-4 transition-all duration-500',
                'transform-gpu',
                'group-hover:scale-110 group-hover:rotate-3',
                isSelected && 'scale-105'
              )}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Тень для 3D эффекта */}
              <div
                className={cn(
                  'absolute inset-0 rounded-xl blur-md opacity-30',
                  'transition-all duration-500',
                  config.iconBg,
                  'group-hover:opacity-50 group-hover:blur-lg',
                  'transform translate-y-2 translate-z-[-10px]'
                )}
              />
              
              {/* Основная иконка с 3D эффектом */}
              <div
                className={cn(
                  'relative rounded-xl p-6',
                  config.iconBg,
                  'shadow-lg',
                  'transition-all duration-500',
                  'group-hover:shadow-xl',
                  'transform'
                )}
                style={{
                  transform: 'translateZ(20px)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Icon
                  className={cn(
                    'h-12 w-12 transition-all duration-500',
                    config.iconColor,
                    'group-hover:scale-110'
                  )}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                  }}
                />
              </div>
            </div>

            {/* Название категории */}
            <span
              className={cn(
                'text-sm font-medium transition-colors duration-300',
                isSelected ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
              )}
            >
              {config.label}
            </span>

            {/* Индикатор выбора */}
            {isSelected && (
              <div className="absolute top-2 right-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  config.dotColor,
                  'shadow-sm'
                )} />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

