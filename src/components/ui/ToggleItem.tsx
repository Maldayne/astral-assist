import { cn } from "@/lib/utils"
import { defineComponent, HTMLAttributes } from "vue"
import { Label } from "./label"
import { Switch } from "./switch"

export default defineComponent({
  name: "ToggleItem",
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit, attrs }) {
    return () => (
      <div class="flex items-center space-x-2">
        <Switch
          checked={props.modelValue}
          onUpdate:checked={(checked: boolean) =>
            emit("update:modelValue", checked)
          }
          disabled={props.disabled}
          class={cn(attrs.class as string)}
          {...(attrs as HTMLAttributes)}
        />
        {props.label && <Label class="ml-2">{props.label}</Label>}
      </div>
    )
  },
})
