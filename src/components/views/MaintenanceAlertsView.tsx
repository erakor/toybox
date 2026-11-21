import React, {useMemo, useState} from 'react';
import {AlertTriangle, CheckCircle2, Search, UserCheck, Wrench, ZapOff} from 'lucide-react';
import {useStationTheme} from '../../context/ThemeContext';
import {AlertLifecycle, AlertSeverity, MaintenanceAlert} from '../../types/factory';

interface MaintenanceAlertsViewProps {
  alerts: MaintenanceAlert[];
  onAcknowledge: (id: string) => void;
  onDispatch: (id: string) => void;
  onResolve: (id: string) => void;
  onInjectFault: () => void;
}

export const MaintenanceAlertsView: React.FC<MaintenanceAlertsViewProps> = ({
  alerts,
  onAcknowledge,
  onDispatch,
  onResolve,
  onInjectFault,
}) => {
  const {theme} = useStationTheme();
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | AlertSeverity>('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return alerts.filter((a) => {
      const matchesFilter =
        filter === 'ALL'
          ? true
          : filter === 'OPEN'
          ? a.lifecycle !== AlertLifecycle.Resolved
          : a.severity === filter;
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.machineName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [alerts, filter, search]);

  const openAlerts = alerts.filter((a) => a.lifecycle !== AlertLifecycle.Resolved);
  const criticalOpen = openAlerts.filter((a) => a.severity === AlertSeverity.Critical).length;
  const dispatchedCount = openAlerts.filter((a) => a.lifecycle === AlertLifecycle.Dispatched).length;
  const resolvedCount = alerts.filter((a) => a.lifecycle === AlertLifecycle.Resolved).length;

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="cartoon-box rounded-3xl p-4" style={{backgroundColor: theme.kpiYellowBg}}>
          <div className="text-xs font-bold bv-muted">Open Alerts</div>
          <div className="font-mono text-2xl font-bold bv-ink tabular-nums mt-1">
            {openAlerts.length}
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5">Active across sector bays</div>
        </div>
        <div className="cartoon-box bv-card rounded-3xl p-4">
          <div className="text-xs font-bold bv-muted">Critical Priority</div>
          <div
            className={`font-mono text-2xl font-bold tabular-nums mt-1 ${
              criticalOpen > 0
                ? theme.isDarkSurface ? 'text-rose-300' : 'text-red-600'
                : theme.isDarkSurface ? 'text-emerald-300' : 'text-emerald-700'
            }`}
          >
            {criticalOpen}
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5">Immediate inspection required</div>
        </div>
        <div className="cartoon-box rounded-3xl p-4" style={{backgroundColor: theme.kpiBlueBg}}>
          <div className="text-xs font-bold bv-muted">Technicians Dispatched</div>
          <div className="font-mono text-2xl font-bold bv-ink tabular-nums mt-1">
            {dispatchedCount}
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5">On-floor crew assigned</div>
        </div>
        <div className="cartoon-box bv-card rounded-3xl p-4">
          <div className="text-xs font-bold bv-muted">Cleared This Shift</div>
          <div className={`font-mono text-2xl font-bold tabular-nums mt-1 ${theme.isDarkSurface ? 'text-emerald-300' : 'text-emerald-700'}`}>
            {resolvedCount}
          </div>
          <div className="text-xs font-medium bv-muted mt-0.5">Verified nominal reset</div>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200 border-[2.5px] bv-border rounded-2xl overflow-x-auto">
          {(['ALL', 'OPEN', AlertSeverity.Critical, AlertSeverity.Warning, AlertSeverity.Advisory] as const).map(
            (tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filter === tab
                    ? 'bg-amber-400 text-slate-950 border-2 border-slate-950'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {tab === 'ALL' ? 'All Alerts' : tab === 'OPEN' ? 'Open Queue' : tab}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alert ID or bay..."
              className="w-full pl-9 pr-4 py-2 bg-white border-[2.5px] bv-border rounded-2xl text-xs font-medium text-slate-950 placeholder:text-slate-500 focus:outline-none focus:bg-amber-50"
            />
          </div>

          <button
            type="button"
            onClick={onInjectFault}
            className="cartoon-btn px-3.5 py-2 rounded-2xl bg-red-500 hover:bg-red-400 text-white text-xs font-bold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ZapOff className="w-3.5 h-3.5" />
            Simulate Fault
          </button>
        </div>
      </div>

      <section className="cartoon-box bv-card rounded-3xl divide-y-2 divide-slate-300/40 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-2 bv-muted">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <div className="text-sm font-bold bv-ink">
              No Maintenance Alerts Match Filter
            </div>
            <p className="text-xs bv-muted max-w-sm">
              Clear search terms or trigger a simulated fault to inspect live alert routing and technician dispatch.
            </p>
          </div>
        ) : (
          filtered.map((alert) => {
            const isResolved = alert.lifecycle === AlertLifecycle.Resolved;
            return (
              <div
                key={alert.id}
                className={`p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
                  isResolved ? 'opacity-65' : 'hover:bg-amber-400/10'
                }`}
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`font-bold inline-flex items-center gap-1 ${
                        isResolved
                          ? theme.isDarkSurface ? 'text-emerald-300' : 'text-emerald-700'
                          : alert.severity === AlertSeverity.Critical
                          ? theme.isDarkSurface ? 'text-rose-300' : 'text-red-600'
                          : alert.severity === AlertSeverity.Warning
                          ? theme.isDarkSurface ? 'text-amber-300' : 'text-amber-700'
                          : theme.isDarkSurface ? 'text-cyan-300' : 'text-blue-700'
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      )}
                      {isResolved ? 'Resolved' : alert.severity}
                    </span>
                    <span aria-hidden="true" className="bv-muted">·</span>
                    <span className="font-mono font-bold bv-ink">{alert.id}</span>
                    <span aria-hidden="true" className="bv-muted">·</span>
                    <span className="bv-ink font-bold">{alert.machineName}</span>
                    <span aria-hidden="true" className="bv-muted">·</span>
                    <span className="bv-muted">{alert.createdAt}</span>
                  </div>

                  <h4 className="font-display text-lg font-bold bv-ink">
                    {alert.title}
                  </h4>
                  <p className="text-xs font-medium bv-muted max-w-3xl">{alert.detail}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    <span className="bv-muted">
                      {alert.metricLabel}:{' '}
                      <span className="font-mono bv-ink font-bold tabular-nums">
                        {alert.metricValue}
                      </span>
                    </span>
                    <span className="bv-muted">
                      Status:{' '}
                      <span className="bv-ink font-bold">{alert.lifecycle}</span>
                    </span>
                    {alert.assignedTech && (
                      <span className={`font-bold ${theme.isDarkSurface ? 'text-cyan-300' : 'text-blue-700'}`}>
                        Assigned: {alert.assignedTech}
                      </span>
                    )}
                  </div>
                </div>

                {!isResolved && (
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {alert.lifecycle === AlertLifecycle.Open && (
                      <button
                        type="button"
                        onClick={() => onAcknowledge(alert.id)}
                        className="cartoon-btn px-3 py-1.5 rounded-2xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-950 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.lifecycle !== AlertLifecycle.Dispatched && (
                      <button
                        type="button"
                        onClick={() => onDispatch(alert.id)}
                        className="cartoon-btn px-3 py-1.5 rounded-2xl bg-cyan-300 hover:bg-cyan-200 text-xs font-bold text-slate-950 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Dispatch Tech
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onResolve(alert.id)}
                      className="cartoon-btn px-3 py-1.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-xs font-bold text-slate-950 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Resolve & Reset
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
