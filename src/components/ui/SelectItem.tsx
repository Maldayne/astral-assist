import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown } from "lucide-vue-next"
import { computed, defineComponent, PropType, ref } from "vue"

interface Option<T extends string> {
  value: T
  label: string
}

export default defineComponent({
  name: "SelectItem",
  props: {
    options: {
      type: Array as PropType<Option<string>[]>,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "Select an option...",
    },
    class: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const open = ref(false)

    const handleSetValue = (val: string) => {
      emit("update:modelValue", val)
      open.value = false
    }

    const selectedLabel = computed(
      () =>
        props.options.find((option) => option.value === props.modelValue)
          ?.label || props.placeholder
    )

    return () => (
      <div class={cn("relative", props.class)}>
        <Popover
          open={open.value}
          onUpdate:open={(value: boolean) => (open.value = value)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open.value}
              class="w-full justify-between"
            >
              {selectedLabel.value}
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-full p-0">
            <Command>
              <CommandInput placeholder={`Search ${props.placeholder}...`} />
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {props.options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSetValue(option.value)}
                    >
                      <Check
                        class={cn(
                          "mr-2 h-4 w-4",
                          props.modelValue === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    )
  },
})
