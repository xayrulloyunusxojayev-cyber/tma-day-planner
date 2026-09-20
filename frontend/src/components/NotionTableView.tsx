import React, { useState } from 'react';
import {
  CheckCircle2,
  List,
  Columns,
  User,
  Calendar,
  Filter,
  ArrowUpDown,
  Search,
  Plus,
  MoreHorizontal,
  Trash2,
  DollarSign,
  Clock,
  ChevronDown
} from 'lucide-react';
import { NotionTask, TaskStatus } from '../types';
import { triggerHaptic } from '../telegram';

interface NotionTableViewProps {
  tasks: NotionTask[];
  onUpdateTask: (task: NotionTask) => void;
  onAddTask: (task: Partial<NotionTask>) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAlarm: () => void;
  alarmTime: string;
  isAlarmActive: boolean;
}

export const NotionTableView: React.FC<NotionTableViewProps> = ({
  tasks,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
  onOpenAlarm,
  alarmTime,
  isAlarmActive,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'status' | 'my' | 'today'>('all');
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof NotionTask } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Status cycling helper
  const nextStatus = (curr: TaskStatus): TaskStatus => {
    if (curr === 'Not started') return 'In progress';
    if (curr === 'In progress') return 'Done';
    return 'Not started';
  };

  const getStatusBadge = (status: TaskStatus, taskId: string) => {
    let bg = 'bg-notion-grayBg text-notion-grayText border-gray-200';
    let dot = 'bg-notion-subtle';

    if (status === 'In progress') {
      bg = 'bg-blue-50 text-blue-700 border-blue-200';
      dot = 'bg-blue-600';
    } else if (status === 'Done') {
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      dot = 'bg-emerald-600';
    }

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          triggerHaptic('selection');
          const task = tasks.find((t) => t.id === taskId);
          if (task) {
            const next = nextStatus(task.status);
            onUpdateTask({
              ...task,
              status: next,
              is_completed: next === 'Done',
            });
          }
        }}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border transition hover:opacity-80 active:scale-95 ${bg}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <span>{status}</span>
      </button>
    );
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (searchQuery.trim() && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (activeTab === 'today') return true;
    if (activeTab === 'status') return t.status !== 'Done';
    return true;
  });

  const totalEarnings = tasks.reduce((sum, t) => sum + (t.revenue || 0), 0);
  const earnedSoFar = tasks
    .filter((t) => t.is_completed || t.status === 'Done')
    .reduce((sum, t) => sum + (t.revenue || 0), 0);

  return (
    <div className="w-full bg-white text-notion-text min-h-screen p-4 sm:p-8 max-w-6xl mx-auto">
      {/* Notion Page Header */}
      <div className="mb-6">
        <div className="text-xs text-notion-muted mb-1 flex items-center gap-2">
          <span>Tasks Tracker and New data source</span>
          <span className="text-notion-subtle">•</span>
          <span className="text-notion-subtle">Private</span>
        </div>
        <p className="text-xs text-notion-muted mb-4">Stay organized with tasks, your way.</p>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-notion-text">
              Tasks Tracker
            </h1>
          </div>

          {/* Alarm & Revenue Header Badges */}
          <div className="flex items-center gap-2">
            {/* Alarm Button in Notion style */}
            <button
              onClick={() => {
                triggerHaptic('impact', 'medium');
                onOpenAlarm();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition ${
                isAlarmActive
                  ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm'
                  : 'bg-white text-notion-muted border-notion-border hover:bg-notion-hover'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Будильник: {alarmTime}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isAlarmActive ? 'bg-amber-500 animate-pulse' : 'bg-gray-300'}`} />
            </button>

            {/* Total Revenue Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Касса: ${earnedSoFar} / ${totalEarnings}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notion View Tabs & Controls */}
      <div className="flex items-center justify-between border-b border-notion-border pb-1.5 mb-0 overflow-x-auto">
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('all');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
              activeTab === 'all'
                ? 'text-notion-text bg-notion-hover font-semibold'
                : 'text-notion-muted hover:text-notion-text hover:bg-notion-hover'
            }`}
          >
            <List className="w-3.5 h-3.5" /> All Tasks
          </button>
          <button
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('status');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
              activeTab === 'status'
                ? 'text-notion-text bg-notion-hover font-semibold'
                : 'text-notion-muted hover:text-notion-text hover:bg-notion-hover'
            }`}
          >
            <Columns className="w-3.5 h-3.5" /> By Status
          </button>
          <button
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('my');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
              activeTab === 'my'
                ? 'text-notion-text bg-notion-hover font-semibold'
                : 'text-notion-muted hover:text-notion-text hover:bg-notion-hover'
            }`}
          >
            <User className="w-3.5 h-3.5" /> My Tasks
          </button>
          <button
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('today');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition font-medium ${
              activeTab === 'today'
                ? 'text-notion-text bg-notion-hover font-semibold'
                : 'text-notion-muted hover:text-notion-text hover:bg-notion-hover'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Today
          </button>
        </div>

        {/* Search, Filter, New Button */}
        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <input
              type="text"
              autoFocus
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => !searchQuery && setIsSearchOpen(false)}
              className="text-xs px-2 py-1 rounded border border-notion-border outline-none w-28 sm:w-40"
            />
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1 rounded text-notion-muted hover:text-notion-text hover:bg-notion-hover transition"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => {
              triggerHaptic('impact', 'medium');
              onAddTask({
                name: 'Новая задача',
                time: '10.00-12.00',
                status: 'Not started',
                due_date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                revenue: 50,
                is_completed: false,
              });
            }}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition active:scale-95 shadow-sm"
          >
            <span>New</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Notion Table Container */}
      <div className="w-full overflow-x-auto border-l border-t border-notion-border">
        <table className="w-full border-collapse text-left text-xs min-w-[700px]">
          <thead>
            <tr className="bg-[#fafaf9]">
              <th className="notion-header-cell px-3 py-2 w-56 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-notion-subtle">Aa</span> Task name
                </span>
              </th>
              <th className="notion-header-cell px-3 py-2 w-36 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-notion-subtle">≡</span> Text / Time
                </span>
              </th>
              <th className="notion-header-cell px-3 py-2 w-28 font-medium">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3 text-notion-subtle" /> Earnings
                </span>
              </th>
              <th className="notion-header-cell px-3 py-2 w-32 font-medium">
                <span className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-notion-subtle" /> Assignee
                </span>
              </th>
              <th className="notion-header-cell px-3 py-2 w-32 font-medium">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-notion-subtle" /> Due date
                </span>
              </th>
              <th className="notion-header-cell px-3 py-2 w-32 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-notion-subtle">☼</span> Status
                </span>
              </th>
              <th className="notion-header-cell px-3 py-2 w-20 font-medium text-center">
                <span>Checkbox</span>
              </th>
              <th className="notion-header-cell px-2 py-2 w-10 text-center text-notion-subtle">
                <span>...</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-[#fbfbfa] transition-colors group"
              >
                {/* Task Name */}
                <td className="notion-cell px-3 py-2 font-medium text-notion-text">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        task.is_completed || task.status === 'Done'
                          ? 'text-emerald-600 fill-emerald-100'
                          : 'text-notion-subtle'
                      }`}
                    />
                    {editingCell?.id === task.id && editingCell?.field === 'name' ? (
                      <input
                        type="text"
                        autoFocus
                        defaultValue={task.name}
                        onBlur={(e) => {
                          onUpdateTask({ ...task, name: e.target.value.trim() || task.name });
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onUpdateTask({ ...task, name: (e.target as HTMLInputElement).value.trim() || task.name });
                            setEditingCell(null);
                          }
                        }}
                        className="w-full bg-blue-50/50 px-1 py-0.5 rounded border border-blue-300 outline-none text-xs"
                      />
                    ) : (
                      <span
                        onClick={() => setEditingCell({ id: task.id, field: 'name' })}
                        className={`cursor-pointer hover:underline truncate ${
                          task.is_completed ? 'line-through text-notion-muted' : ''
                        }`}
                      >
                        {task.name}
                      </span>
                    )}
                  </div>
                </td>

                {/* Time / Text */}
                <td className="notion-cell px-3 py-2 text-notion-text">
                  {editingCell?.id === task.id && editingCell?.field === 'time' ? (
                    <input
                      type="text"
                      autoFocus
                      defaultValue={task.time}
                      onBlur={(e) => {
                        onUpdateTask({ ...task, time: e.target.value.trim() || task.time });
                        setEditingCell(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onUpdateTask({ ...task, time: (e.target as HTMLInputElement).value.trim() || task.time });
                          setEditingCell(null);
                        }
                      }}
                      className="w-full bg-blue-50/50 px-1 py-0.5 rounded border border-blue-300 outline-none text-xs font-mono"
                    />
                  ) : (
                    <span
                      onClick={() => setEditingCell({ id: task.id, field: 'time' })}
                      className="cursor-pointer hover:underline font-mono text-notion-muted hover:text-notion-text text-[11px]"
                    >
                      {task.time || '—'}
                    </span>
                  )}
                </td>

                {/* Earnings */}
                <td className="notion-cell px-3 py-2 text-notion-text font-semibold">
                  {editingCell?.id === task.id && editingCell?.field === 'revenue' ? (
                    <input
                      type="number"
                      autoFocus
                      defaultValue={task.revenue}
                      onBlur={(e) => {
                        onUpdateTask({ ...task, revenue: parseFloat(e.target.value) || 0 });
                        setEditingCell(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onUpdateTask({ ...task, revenue: parseFloat((e.target as HTMLInputElement).value) || 0 });
                          setEditingCell(null);
                        }
                      }}
                      className="w-full bg-blue-50/50 px-1 py-0.5 rounded border border-blue-300 outline-none text-xs font-mono"
                    />
                  ) : (
                    <span
                      onClick={() => setEditingCell({ id: task.id, field: 'revenue' })}
                      className={`cursor-pointer hover:underline ${
                        task.is_completed || task.status === 'Done' ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      ${task.revenue || 0}
                    </span>
                  )}
                </td>

                {/* Assignee */}
                <td className="notion-cell px-3 py-2 text-notion-text">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-700 text-[9px] font-bold text-white flex items-center justify-center">
                      H
                    </div>
                    <span className="text-notion-muted">Hayrullo</span>
                  </div>
                </td>

                {/* Due Date */}
                <td className="notion-cell px-3 py-2 text-notion-muted">
                  {task.due_date}
                </td>

                {/* Status */}
                <td className="notion-cell px-3 py-2">
                  {getStatusBadge(task.status, task.id)}
                </td>

                {/* Checkbox */}
                <td className="notion-cell px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={task.is_completed || task.status === 'Done'}
                    onChange={() => {
                      triggerHaptic('impact', 'medium');
                      const nextState = !task.is_completed;
                      onUpdateTask({
                        ...task,
                        is_completed: nextState,
                        status: nextState ? 'Done' : 'In progress',
                      });
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </td>

                {/* Actions (Delete) */}
                <td className="notion-cell px-2 py-2 text-center">
                  <button
                    onClick={() => {
                      triggerHaptic('impact', 'light');
                      onDeleteTask(task.id);
                    }}
                    className="p-1 rounded text-notion-subtle hover:text-rose-600 hover:bg-rose-50 transition opacity-0 group-hover:opacity-100"
                    title="Удалить строку"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}

            {/* + New task row */}
            <tr>
              <td
                colSpan={8}
                onClick={() => {
                  triggerHaptic('selection');
                  onAddTask({
                    name: 'Новая задача',
                    time: '12.00-14.00',
                    status: 'Not started',
                    due_date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
                    revenue: 0,
                    is_completed: false,
                  });
                }}
                className="notion-cell px-3 py-2 text-notion-muted hover:bg-[#f7f7f5] hover:text-notion-text cursor-pointer transition font-medium"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-3.5 h-3.5 text-notion-subtle" />
                  <span>New task</span>
                </div>
              </td>
            </tr>

            {/* Calculate / Sum Row */}
            <tr className="bg-[#fafaf9] text-notion-muted font-medium">
              <td className="notion-cell px-3 py-1.5 text-[11px]">
                Count: {filteredTasks.length}
              </td>
              <td className="notion-cell px-3 py-1.5 text-[11px]">
                —
              </td>
              <td className="notion-cell px-3 py-1.5 text-[11px] text-emerald-800 font-bold">
                Sum: ${totalEarnings}
              </td>
              <td className="notion-cell px-3 py-1.5 text-[11px]" colSpan={5}>
                Earned: ${earnedSoFar}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
