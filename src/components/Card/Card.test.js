import React from "react";
import { shallow } from "enzyme";
import Card from "components/Card";

describe("<Card />", () => {
  describe("default render", () => {
    it("should render", () => {
      const wrapper = shallow(<Card title="Test" />);
      expect(wrapper.find(".usa-card")).toBeTruthy();
    });
    it("should alert invalid variant", () => {
      global.console = { warn: jest.fn(), error: jest.fn() };
      const wrapper = shallow(<Card title="Test" variant="test" />);
      expect(wrapper.find(".usa-card")).toBeTruthy();
      expect(console.warn).toBeCalled();
      expect(console.error).toBeCalled();
    });
  });
  describe("props", () => {
    it("should render with all props", async () => {
      const props = {
        className: "test",
        image: "test",
        imageAlt: "test",
        meta: "test",
        title: "test",
        excerpt: "test",
        footer: "test",
        variant: "horizontal",
        flat: true,
      };
      const wrapper = shallow(<Card {...props} />);
      expect(wrapper.find(".usa-card")).toBeTruthy();
      expect(wrapper.find(".usa-card--flag")).toBeTruthy();
    });
    it("should render with no content", async () => {
      const props = {
        className: "test",
        image: "test",
        imageAlt: "test",
        footer: "test",
        variant: "vertical",
        flat: true,
      };
      const wrapper = shallow(<Card {...props} />);
      expect(wrapper.find(".usa-card--no-content")).toBeTruthy();
      expect(Object.keys(wrapper.find(".usa-card__header")).length).toBeFalsy();
    });
  });
});
