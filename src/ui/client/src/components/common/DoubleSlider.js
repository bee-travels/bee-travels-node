import React, { useEffect, useState } from "react";

import nouislider from "nouislider";
import "./slider.css";

const sortObjectKeys = obj =>
  Object.entries(obj)
    .sort()
    .reduce((o, [k, v]) => ((o[k] = v), o), {});

export const isEqual = (val1, val2) => {
  if (typeof val1 === "number" && typeof val2 === "number")
    return val1 === val2;
  if (typeof val1 === "string" && typeof val2 === "string")
    return val1 === val2;
  if (Array.isArray(val1) && Array.isArray(val2)) {
    return JSON.stringify(val1) === JSON.stringify(val2);
  }
  if (typeof val1 === "object" && typeof val2 === "object") {
    return (
      JSON.stringify(sortObjectKeys(val1)) ===
      JSON.stringify(sortObjectKeys(val2))
    );
  }
  return false;
};

const areEqual = (prevProps, nextProps) => {
  const { start, disabled, range } = prevProps;
  return (
    isEqual(nextProps.start, start) &&
    nextProps.disabled === disabled &&
    isEqual(nextProps.range, range)
  );
};

const DoubleSlider = props => {
  const [slider, setSlider] = useState(null);
  const sliderContainer = React.createRef();

  useEffect(() => {
    const { instanceRef } = props;
    const isCreatedRef =
      instanceRef &&
      Object.prototype.hasOwnProperty.call(instanceRef, "current");
    if (instanceRef && instanceRef instanceof Function) {
      instanceRef(sliderContainer.current);
    }

    if (isCreatedRef) {
      // eslint-disable-next-line no-param-reassign
      instanceRef.current = sliderContainer.current;
    }

    return () => {
      if (isCreatedRef) {
        // eslint-disable-next-line no-param-reassign
        instanceRef.current = null;
      }
    };
  }, [sliderContainer]);

  const clickOnPip = pip => {
    const value = Number(pip.target.getAttribute("data-value"));
    if (slider) {
      slider.set(value);
    }
  };

  const toggleDisable = disabled => {
    const sliderHTML = sliderContainer.current;
    if (sliderHTML) {
      if (!disabled) {
        sliderHTML.removeAttribute("disabled");
      } else {
        sliderHTML.setAttribute("disabled", true);
      }
    }
  };

  const updateRange = range => {
    const sliderHTML = sliderContainer.current;
    sliderHTML.noUiSlider.updateOptions({ range });
  };

  const createSlider = () => {
    const { onUpdate, onChange, onSlide, onStart, onEnd, onSet } = props;
    const sliderComponent = nouislider.create(sliderContainer.current, {
      ...props
    });

    if (onStart) {
      sliderComponent.on("start", onStart);
    }

    if (onSlide) {
      sliderComponent.on("slide", onSlide);
    }

    if (onUpdate) {
      sliderComponent.on("update", onUpdate);
    }

    if (onChange) {
      sliderComponent.on("change", onChange);
    }

    if (onSet) {
      sliderComponent.on("set", onSet);
    }

    if (onEnd) {
      sliderComponent.on("end", onEnd);
    }

    setSlider(sliderComponent);
  };

  useEffect(() => {
    const { disabled } = props;
    const sliderHTML = sliderContainer.current;
    if (sliderHTML) {
      toggleDisable(disabled);
      createSlider();
    }
  }, []);

  useEffect(() => {
    if (props.clickablePips) {
      const sliderHTML = sliderContainer.current;
      sliderHTML.querySelectorAll(".noUi-value").forEach(pip => {
        pip.style.cursor = "pointer";
        pip.addEventListener("click", clickOnPip);
      });
    }
    return () => {
      const sliderHTML = sliderContainer.current;
      if (slider) slider.destroy();
      if (sliderHTML) {
        sliderHTML.querySelectorAll(".noUi-value").forEach(pip => {
          pip.removeEventListener("click", clickOnPip);
        });
      }
    };
  }, [slider]);

  const { start, disabled, range } = props;

  useEffect(() => {
    if (slider) {
      updateRange(range);
      slider.set(start);
    }
    toggleDisable(disabled);
  }, [start, disabled, range]);

  const { id, className, style } = props;
  const options = {};
  if (id) {
    options.id = id;
  }
  if (className) {
    options.className = className;
  }
  return <div {...options} ref={sliderContainer} style={style} />;
};

export default React.memo(DoubleSlider, areEqual);
