import React from "react";
import { shallow } from "enzyme";
import Default from "routes/Default";

describe("<Default />", () => {
  describe("default render", () => {
    it("should render", () => {
      const wrapper = shallow(<Default />);
      expect(wrapper.find(".App-header")).toBeTruthy();
    });
  });
});
