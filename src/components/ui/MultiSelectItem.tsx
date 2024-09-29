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
import { computed, defineComponent, PropType, ref, watchEffect } from "vue"

interface Item {
  value: string
  label: string
  color?: string // Optional color property
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
    defaultValue: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const open = ref(false)
    const selectedItems = ref<string[]>([])

    watchEffect(() => {
      selectedItems.value =
        props.modelValue.length > 0 ? props.modelValue : props.defaultValue
    })

    const handleSetValue = (val: string) => {
      const newValue = selectedItems.value.includes(val)
        ? selectedItems.value.filter((item) => item !== val)
        : [...selectedItems.value, val]
      emit("update:modelValue", newValue)
    }

    const handleSelectAll = () => {
      const newValue = isAllSelected.value
        ? []
        : props.items.map((item) => item.value)
      emit("update:modelValue", newValue)
    }

    const isAllSelected = computed(
      () => selectedItems.value.length === props.items.length
    )

    const selectedLabels = computed(
      () =>
        selectedItems.value
          .map((val) => props.items.find((item) => item.value === val))
          .filter(Boolean) as Item[]
    )

    return () => (
      <div class="w-full">
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
              <div class="flex gap-2 justify-start">
                {selectedLabels.value.length > 0
                  ? selectedLabels.value.map((item, i) => (
                      <div
                        key={i}
                        class={cn(
                          "px-2 py-1 rounded-xl border text-xs font-medium",
                          item.color && `border-[${item.color}]`
                        )}
                        style={item.color ? { borderColor: item.color } : {}}
                      >
                        {item.label}
                      </div>
                    ))
                  : props.placeholder}
              </div>
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-full p-0">
            <Command>
              <CommandInput placeholder={`Search ${props.placeholder}...`} />
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                <CommandItem onSelect={handleSelectAll} value="__select_all__">
                  <div class="flex items-center">
                    <Check
                      class={cn(
                        "mr-2 h-4 w-4",
                        isAllSelected.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    Select All
                  </div>
                </CommandItem>
                <CommandList>
                  {props.items.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSetValue(option.value)}
                      value={option.value}
                    >
                      <div class="flex items-center">
                        {selectedItems.value.includes(option.value) ? (
                          <Check
                            class="mr-2 h-4 w-4"
                            style={option.color ? { color: option.color } : {}}
                          />
                        ) : (
                          <div class="mr-2 h-4 w-4 flex items-center justify-center">
                            <div
                              class="w-1 h-1 rounded-full"
                              style={
                                option.color
                                  ? { backgroundColor: option.color }
                                  : {}
                              }
                            />
                          </div>
                        )}
                        {option.label}
                      </div>
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
