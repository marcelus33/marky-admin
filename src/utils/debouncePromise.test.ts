import { debouncePromise } from "./debouncePromise";

describe("debouncePromise", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("collapses a burst of calls into a single underlying invocation", async () => {
    const fn = jest.fn().mockResolvedValue("result");
    const debounced = debouncePromise(fn, 300);

    const p1 = debounced("a");
    const p2 = debounced("b");
    const p3 = debounced("c");

    jest.advanceTimersByTime(300);

    await expect(p1).resolves.toBe("result");
    await expect(p2).resolves.toBe("result");
    await expect(p3).resolves.toBe("result");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c");
  });

  it("triggers a new call once the delay has fully elapsed", async () => {
    const fn = jest.fn().mockResolvedValue("result");
    const debounced = debouncePromise(fn, 300);

    const p1 = debounced("a");
    jest.advanceTimersByTime(300);
    await p1;

    const p2 = debounced("b");
    jest.advanceTimersByTime(300);
    await p2;

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("propagates a rejection to every waiting caller", async () => {
    const fn = jest.fn().mockRejectedValue(new Error("boom"));
    const debounced = debouncePromise(fn, 300);

    const p1 = debounced("a");
    const p2 = debounced("b");

    jest.advanceTimersByTime(300);

    await expect(p1).rejects.toThrow("boom");
    await expect(p2).rejects.toThrow("boom");
  });
});
