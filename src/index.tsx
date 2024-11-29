import { Profiler, ProfilerOnRenderCallback } from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);

const onRenderCallback: ProfilerOnRenderCallback = (
    _id,
    phase,
    actualDuration,
    _baseDuration,
    _startTime,
    _commitTime
) => {
    console.log(
        `phase: ${phase}
actualDuration: ${actualDuration}`
    );
};

root.render(
    <Profiler id="Profiler" onRender={onRenderCallback}>
        <App />
    </Profiler>
);
