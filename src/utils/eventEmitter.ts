type EventCallback = (data?: any) => void;

class CustomEventEmitter {
    private events: { [eventName: string]: EventCallback[] } = {};

    on(eventName: string, callback: EventCallback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    emit(eventName: string, data?: any) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => callback(data));
        }
    }

    off(eventName: string, callback: EventCallback) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
        }
    }

    addListener(eventName: string, callback: EventCallback) {
        this.on(eventName, callback);
    }

    removeListener(eventName: string, callback: EventCallback) {
        this.off(eventName, callback);
    }
}

const eventEmitter = new CustomEventEmitter();
export default eventEmitter;
