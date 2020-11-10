/**
 * Basically a lock that prevents things from progressing until they are ready. If this list is empty, the server is ready.
 */

export class ReadyLock {
    private static ReadyUpLockList: string[] = [];

    static addReadyLock(object: string): void {
        ReadyLock.ReadyUpLockList.push(object);
    }

    static removeReadyLock(object: string): void {
        let start = ReadyLock.ReadyUpLockList.indexOf(object);

        if (start > -1)
            ReadyLock.ReadyUpLockList.splice(start, 1);
    }

    static isReady(): boolean {
        return ReadyLock.ReadyUpLockList.length === 0;
    }
}
