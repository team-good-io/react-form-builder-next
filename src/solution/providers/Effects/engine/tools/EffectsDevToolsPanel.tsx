import React, { useEffect, useRef, useState } from 'react';

/* ---------------------------------------------
 * Types
 * --------------------------------------------- */

export type EffectEngineEvent =
  | { type: 'queueAction'; action: any }
  | { type: 'flushStart'; queue: any[] }
  | { type: 'flushEnd' }
  | { type: 'conditionEvaluated'; condition: any; result: boolean }
  | { type: 'ruleMatched'; ruleId: string }
  | { type: 'executeAction'; action: any }
  | { type: 'initStart'; values: Record<string, unknown> }
  | { type: 'initEnd' }
  | { type: 'runEffectsStart'; values: Record<string, unknown>; changedField: string }
  | { type: 'runEffectsEnd'; changedField: string };

type DevtoolsPanelProps = {
  subscribe: (listener: (event: EffectEngineEvent) => void) => () => void;
};

/* ---------------------------------------------
 * Component
 * --------------------------------------------- */

export const EffectsDevtoolsPanel: React.FC<DevtoolsPanelProps> = ({ subscribe }) => {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribe(event => {
      setTimeline(prev => updateTimeline(prev, event));
    });
    return unsubscribe;
  }, [subscribe]);

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = timelineRef.current.scrollHeight;
    }
  }, [timeline]);

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        width: 500,
        maxHeight: '60vh',
        backgroundColor: '#1e1e1e',
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: 12,
        borderRadius: 8,
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '8px 12px', background: '#333', borderBottom: '1px solid #444' }}>
        <strong>🧩 Effects Engine Timeline</strong>
      </div>

      <div
        ref={timelineRef}
        style={{
          padding: 8,
          overflowY: 'auto',
          flexGrow: 1,
        }}
      >
        {timeline.map((entry, index) => (
          <div key={index} style={{ marginBottom: 8 }}>
            <div style={{ color: '#aaa', marginBottom: 4 }}>
              ⏱️ {new Date(entry.timestamp).toLocaleTimeString()} — Tick {index + 1}
            </div>
            {entry.events.map((event, idx) => (
              <div key={idx} style={{ marginLeft: 8, marginBottom: 2 }}>
                <EventDisplay event={event} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------------------------------------
 * Timeline Management
 * --------------------------------------------- */

type TimelineEntry = {
  timestamp: number;
  events: EffectEngineEvent[];
};

function updateTimeline(current: TimelineEntry[], event: EffectEngineEvent): TimelineEntry[] {
  const now = Date.now();

  // Start a new tick on 'flushStart'
  if (event.type === 'flushStart' || current.length === 0) {
    return [...current, { timestamp: now, events: [event] }];
  }

  // Append to current tick
  const updated = [...current];
  updated[updated.length - 1].events.push(event);
  return updated;
}

/* ---------------------------------------------
 * Event Display
 * --------------------------------------------- */

const EventDisplay: React.FC<{ event: EffectEngineEvent }> = ({ event }) => {
  const colorMap: Record<string, string> = {
    queueAction: '#FFD700',
    flushStart: '#FF8C00',
    flushEnd: '#FF8C00',
    conditionEvaluated: '#7FFFD4',
    ruleMatched: '#00FA9A',
    executeAction: '#ADFF2F',
    initStart: '#87CEFA',
    initEnd: '#87CEFA',
    runEffectsStart: '#87CEFA',
    runEffectsEnd: '#87CEFA',
  };

  return (
    <div style={{ color: colorMap[event.type] || '#fff' }}>
      <strong>{event.type}</strong>
      {' - '}
      <span>{formatEvent(event)}</span>
    </div>
  );
};

function formatEvent(event: EffectEngineEvent): string {
  switch (event.type) {
    case 'queueAction':
    case 'executeAction':
      return `target: ${event.action.target} (${event.action.type})`;
    case 'flushStart':
      return `actions: ${event.queue.length}`;
    case 'conditionEvaluated':
      return `field(s): ${collectFields(event.condition).join(', ')} -> ${event.result}`;
    case 'ruleMatched':
      return `rule: ${event.ruleId}`;
    case 'initStart':
      return `values: ${Object.keys(event.values).join(', ')}`;
    case 'runEffectsStart':
      return `changed field: ${event.changedField}`;
    default:
      return '';
  }
}

// Helper to display condition fields
function collectFields(condition: any): string[] {
  if ('type' in condition) {
    switch (condition.type) {
      case 'AND':
      case 'OR':
        return condition.conditions.flatMap(collectFields);
      case 'NOT':
        return collectFields(condition.condition);
      default:
        return [];
    }
  } else {
    return [condition.field];
  }
}
