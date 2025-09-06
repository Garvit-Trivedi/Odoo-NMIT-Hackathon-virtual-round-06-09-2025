import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { motion } from 'framer-motion'
import { Plus, MoreVertical } from 'lucide-react'
import TaskCard from './TaskCard'
import CreateTaskModal from './CreateTaskModal'
import api from '../../services/api'
import toast from 'react-hot-toast'

const TaskBoard = ({ tasks, projectId, onTaskUpdate, onTaskCreate }) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState('todo')

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'inprogress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' }
  ]

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const { draggableId, destination } = result
    const newStatus = destination.droppableId

    try {
      const response = await api.patch(`/tasks/${draggableId}`, {
        status: newStatus
      })
      
      onTaskUpdate(response.data)
      toast.success('Task updated successfully')
    } catch (error) {
      toast.error('Failed to update task')
      console.error('Error updating task:', error)
    }
  }

  const handleCreateTask = (status) => {
    setSelectedColumn(status)
    setShowCreateModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Task Board</h3>
        <button
          onClick={() => handleCreateTask('todo')}
          className="btn btn-primary btn-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id)
            
            return (
              <div key={column.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">{column.title}</h4>
                    <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCreateTask(column.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] rounded-lg p-2 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-primary-50' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-transform ${
                                snapshot.isDragging ? 'rotate-2 scale-105' : ''
                              }`}
                            >
                              <TaskCard task={task} compact />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      
                      {columnTasks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">No tasks in {column.title.toLowerCase()}</p>
                          <button
                            onClick={() => handleCreateTask(column.id)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                          >
                            Add first task
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
        </div>
      </DragDropContext>

      {showCreateModal && (
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          projectId={projectId}
          initialStatus={selectedColumn}
          onTaskCreate={onTaskCreate}
        />
      )}
    </div>
  )
}

export default TaskBoard
