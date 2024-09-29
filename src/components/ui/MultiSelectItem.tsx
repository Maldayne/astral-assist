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

interface Item {
  value: string
  label: string
}

export default defineComponent({
  name: "MultiSelectItem",
  props: {
    items: {
      type: Array as PropType<Item[]>,
      required: true,
    },
    modelValue: {
      type: Array as PropType<string[]>,
      required: true,
    },
    placeholder: {
      type: String,
      default: "Select options...",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const open = ref(false)

    const handleSetValue = (val: string) => {
      const newValue = [...props.modelValue]
      const index = newValue.indexOf(val)
      if (index !== -1) {
        newValue.splice(index, 1)
      } else {
        newValue.push(val)
      }
      emit("update:modelValue", newValue)
    }

    const selectedLabels = computed(() =>
      props.modelValue.map(
        (val) => props.items.find((option) => option.value === val)?.label
      )
    )

    return () => (
      <Popover
        open={open.value}
        onUpdate:open={(value: boolean) => (open.value = value)}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open.value}
            class="w-[480px] justify-between"
          >
            <div class="flex gap-2 justify-start">
              {props.modelValue.length
                ? selectedLabels.value.map((label, i) => (
                    <div
                      key={i}
                      class="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                    >
                      {label}
                    </div>
                  ))
                : props.placeholder}
            </div>
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[480px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${props.placeholder}...`} />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {props.items.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleSetValue(option.value)}
                  >
                    <Check
                      class={cn(
                        "mr-2 h-4 w-4",
                        props.modelValue.includes(option.value)
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
    )
  },
})
