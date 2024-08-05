// assets/scripts/DelayedAction.ts
export default class DelayedAction {
    private static instances = new Map<string, DelayedAction>(); // 用于跟踪所有延时实例

    private delayMilliseconds: number;
    private startTime: number;
    private remainingTime: number;
    private resolve: (() => void) | null;
    private timeoutId: number | null;
    private id: string; // 唯一标识符

    private constructor(delaySeconds: number, id: string) {
        this.delayMilliseconds = delaySeconds * 1000; // 转换为毫秒
        this.remainingTime = this.delayMilliseconds;
        this.resolve = null;
        this.timeoutId = null;
        this.startTime = 0;
        this.id = id;

        // 注册游戏事件监听
        cc.game.on(cc.game.EVENT_HIDE, this.onPause, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onResume, this);
    }

    public static createInstance(delaySeconds: number, id: string): DelayedAction {
        const instance = new DelayedAction(delaySeconds, id);
        this.instances.set(id, instance);
        return instance;
    }

    public static cancelInstance(id: string): void {
        const instance = this.instances.get(id);
        if (instance) {
            instance.cancel();
            this.instances.delete(id);
        }
    }

    private onPause() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
            const elapsed = Date.now() - this.startTime;
            this.remainingTime -= elapsed;
        }
    }

    private onResume() {
        if (this.resolve) {
            this.startTimeout(this.remainingTime);
        }
    }

    private startTimeout(remainingTime: number) {
        this.startTime = Date.now();
        this.timeoutId = setTimeout(() => {
            if (this.resolve) {
                this.resolve();
                this.destroy();  // 延时结束后自动清理资源
            }
        }, remainingTime) as any;
    }

    public async start(): Promise<void> {
        return new Promise((resolve) => {
            this.resolve = resolve;
            this.startTimeout(this.remainingTime);
        });
    }

    public cancel() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        this.destroy();
    }

    private destroy() {
        cc.game.off(cc.game.EVENT_HIDE, this.onPause, this);
        cc.game.off(cc.game.EVENT_SHOW, this.onResume, this);
        this.resolve = null;
    }
}
