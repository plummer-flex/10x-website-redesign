import React from "react";
import { mount } from "enzyme";
import PageList from "./index";
import TestProvider from "test/TestProvider";
import store from "app";
import runAsyncRender from "test/utils/runAsyncRender";

describe("PageList", () => {
  describe("default render", () => {
    it("should render two titles", async () => {
      const wrapper = mount(
        <TestProvider store={store}>
          <PageList />
        </TestProvider>
      );
      await runAsyncRender(wrapper);

      expect(wrapper.find(".PageList__item").length).toBe(2);
    });
    it("should render error on incorrect type", async () => {
      const wrapper = mount(
        <TestProvider store={store}>
          <PageList type="error" />
        </TestProvider>
      );
      await runAsyncRender(wrapper);

      expect(wrapper.find(".PageList__error").length).toBe(1);
    });
  });
});
