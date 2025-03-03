import * as React from 'react';
import { UseButtonRootSlotProps } from '../ButtonUnstyled';
import {
  OptionState,
  UseListboxOptionSlotProps,
  UseListboxRootSlotProps,
} from '../ListboxUnstyled';
import { EventHandlers } from '../utils/types';
import { SelectChangeNotifiers } from './useSelectChangeNotifiers';

export interface SelectOption<TValue> {
  value: TValue;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectOptionGroup<TValue> {
  options: SelectChild<TValue>[];
  label: React.ReactNode;
  disabled?: boolean;
}

export type SelectChild<TValue> = SelectOption<TValue> | SelectOptionGroup<TValue>;

export function isOptionGroup<TValue>(
  child: SelectChild<TValue>,
): child is SelectOptionGroup<TValue> {
  return !!(child as SelectOptionGroup<TValue>).options;
}

export type SelectChangeEventType =
  | React.MouseEvent<Element, MouseEvent>
  | React.KeyboardEvent<Element>
  | React.FocusEvent<Element, Element>
  | null;

interface UseSelectCommonProps<TValue> {
  buttonRef?: React.Ref<Element>;
  disabled?: boolean;
  listboxId?: string;
  listboxRef?: React.Ref<Element>;
  onOpenChange?: (open: boolean) => void;
  onHighlightChange?: (
    e:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    highlighted: TValue | null,
  ) => void;
  open?: boolean;
  options: SelectOption<TValue>[];
  optionStringifier?: (option: SelectOption<TValue>) => string;
}

export interface UseSelectSingleParameters<TValue> extends UseSelectCommonProps<TValue> {
  defaultValue?: TValue | null;
  multiple?: false;
  onChange?: (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: TValue | null,
  ) => void;
  value?: TValue | null;
}

export interface UseSelectMultiParameters<TValue> extends UseSelectCommonProps<TValue> {
  defaultValue?: TValue[];
  multiple: true;
  onChange?: (
    e: React.MouseEvent | React.KeyboardEvent | React.FocusEvent | null,
    value: TValue[],
  ) => void;
  value?: TValue[];
}

export type UseSelectParameters<TValue> =
  | UseSelectSingleParameters<TValue>
  | UseSelectMultiParameters<TValue>;

interface UseSelectButtonSlotEventHandlers {
  onClick: React.MouseEventHandler;
  onKeyDown: React.KeyboardEventHandler;
  onMouseDown: React.MouseEventHandler<HTMLElement>;
}

export type UseSelectButtonSlotProps<TOther = {}> = UseButtonRootSlotProps<
  Omit<TOther, keyof UseSelectButtonSlotEventHandlers> & UseSelectButtonSlotEventHandlers
> & {
  'aria-expanded': React.AriaAttributes['aria-expanded'];
  'aria-haspopup': React.AriaAttributes['aria-haspopup'];
};

interface UseSelectListboxSlotEventHandlers {
  onBlur: React.FocusEventHandler;
  onKeyUp: React.KeyboardEventHandler;
}

export type UseSelectListboxSlotProps<TOther = {}> = UseListboxRootSlotProps<
  Omit<TOther, keyof UseSelectListboxSlotEventHandlers> & UseSelectListboxSlotEventHandlers
>;

interface UseSelectOptionSlotEventHandlers {
  onClick: React.MouseEventHandler;
}

export type UseSelectOptionSlotProps<TOther = {}> = UseListboxOptionSlotProps<
  Omit<TOther, keyof UseSelectOptionSlotEventHandlers> & UseSelectOptionSlotEventHandlers
>;

interface UseSelectCommonResult<TValue> {
  buttonActive: boolean;
  buttonFocusVisible: boolean;
  disabled: boolean;
  getButtonProps: <TOther extends EventHandlers = {}>(
    otherHandlers?: TOther,
  ) => UseSelectButtonSlotProps<TOther>;
  getListboxProps: <TOther extends EventHandlers = {}>(
    otherHandlers?: TOther,
  ) => UseSelectListboxSlotProps<TOther>;
  contextValue: {
    getOptionProps: <TOther extends EventHandlers = {}>(
      option: SelectOption<TValue>,
      otherHandlers?: TOther,
    ) => UseSelectOptionSlotProps<TOther>;
    getOptionState: (option: SelectOption<TValue>) => OptionState;
    listboxRef: React.RefObject<HTMLElement>;
    /**
     * Registers a handler for when the highlighted option changes.
     * @param handler A function that will be called with the new highlighted option.
     */
    registerHighlightChangeHandler: SelectChangeNotifiers<TValue>['registerHighlightChangeHandler'];
    /**
     * Registers a handler for when the selection changes.
     * @param handler A function that will be called with the new selected items.
     */
    registerSelectionChangeHandler: SelectChangeNotifiers<TValue>['registerSelectionChangeHandler'];
  };
  open: boolean;
  highlightedOption: TValue | null;
}

export interface UseSelectSingleResult<TValue> extends UseSelectCommonResult<TValue> {
  value: TValue | null;
}

export interface UseSelectMultiResult<TValue> extends UseSelectCommonResult<TValue> {
  value: TValue[];
}
