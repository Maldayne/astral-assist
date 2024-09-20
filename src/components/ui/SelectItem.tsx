import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem as ShadcnSelectItem,
} from "@/components/ui/select"
import { defineComponent, PropType } from "vue"

interface Option {
  value: string
  label: string
}

export default defineComponent({
  name: "SelectItem",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array as PropType<Option[]>,
      required: true,
    },
    placeholder: {
      type: String,
      default: "Select an option",
    },
    class: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const handleValueChange = (value: string) => {
      emit("update:modelValue", value)
    }

    return () => (
      <Select
        modelValue={props.modelValue}
        onUpdate:modelValue={handleValueChange}
      >
        <SelectTrigger class={props.class}>
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {props.options.map((option) => (
            <ShadcnSelectItem key={option.value} value={option.value}>
              {option.label}
            </ShadcnSelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  },
})
