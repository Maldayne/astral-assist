// import { Assistant, AssistantGroup } from "@/types/assistant"
// import { defineStore } from "pinia"
// import { computed, ref } from "vue"

// export const useAssistantStore = defineStore("assistant", () => {
//   const assistantGroups = ref<AssistantGroup[]>([
//     {
//       id: "1",
//       name: "Default Group",
//       assistants: [
//         {
//           id: "1",
//           name: "Alpha",
//           avatar: "/path/to/avatar1.png",
//           type: "query",
//         },
//         {
//           id: "2",
//           name: "Bravo",
//           avatar: "/path/to/avatar2.png",
//           type: "command",
//         },
//         {
//           id: "3",
//           name: "Charlie",
//           avatar: "/path/to/avatar3.png",
//           type: "query",
//         },
//         {
//           id: "4",
//           name: "Delta",
//           avatar: "/path/to/avatar4.png",
//           type: "command",
//         },
//         {
//           id: "5",
//           name: "Echo",
//           avatar: "/path/to/avatar5.png",
//           type: "query",
//         },
//       ],
//     },
//     {
//       id: "2",
//       name: "Space Game",
//       assistants: [
//         {
//           id: "6",
//           name: "Apollo",
//           avatar: "/path/to/avatar6.png",
//           type: "query",
//         },
//         {
//           id: "7",
//           name: "Artemis",
//           avatar: "/path/to/avatar7.png",
//           type: "command",
//         },
//       ],
//     },
//     {
//       id: "3",
//       name: "Single Assistant Group",
//       assistants: [
//         {
//           id: "8",
//           name: "OnlyOneAssistantInThisGroup",
//           avatar: "/path/to/avatar8.png",
//           type: "query",
//         },
//       ],
//     },
//   ])

//   const individualAssistants = ref<Assistant[]>([
//     {
//       id: "9",
//       name: "Solo Assistant",
//       avatar: "/path/to/avatar9.png",
//       type: "command",
//     },
//   ])

//   const activeGroupId = ref<string | null>(assistantGroups.value[0].id)
//   const activeAssistantId = ref<string>(
//     assistantGroups.value[0].assistants[0].id
//   )

//   const allAssistants = computed((): Assistant[] => {
//     return [
//       ...assistantGroups.value.flatMap((group) => group.assistants),
//       ...individualAssistants.value,
//     ]
//   })

//   const activeGroup = computed(() =>
//     activeGroupId.value
//       ? assistantGroups.value.find((group) => group.id === activeGroupId.value)
//       : null
//   )

//   const activeAssistant = computed(() =>
//     allAssistants.value.find(
//       (assistant) => assistant.id === activeAssistantId.value
//     )
//   )

//   const currentAssistants = computed((): Assistant[] => {
//     if (activeGroupId.value) {
//       return activeGroup.value?.assistants || []
//     } else {
//       return individualAssistants.value
//     }
//   })

//   function setActiveAssistantOrGroup(id: string) {
//     const group = assistantGroups.value.find((g) => g.id === id)
//     if (group) {
//       activeGroupId.value = id
//       activeAssistantId.value = group.assistants[0].id
//     } else {
//       const assistant = individualAssistants.value.find((a) => a.id === id)
//       if (assistant) {
//         activeGroupId.value = null
//         activeAssistantId.value = id
//       }
//     }
//   }

//   function setActiveAssistant(assistantId: string) {
//     const assistant = allAssistants.value.find((a) => a.id === assistantId)
//     if (assistant) {
//       activeAssistantId.value = assistantId
//       const group = assistantGroups.value.find((g) =>
//         g.assistants.includes(assistant)
//       )
//       activeGroupId.value = group ? group.id : null
//     }
//   }

//   function addAssistantGroup(name: string) {
//     const newId = (
//       parseInt(assistantGroups.value[assistantGroups.value.length - 1].id) + 1
//     ).toString()
//     assistantGroups.value.push({
//       id: newId,
//       name,
//       assistants: [],
//     })
//   }

//   function addAssistantToGroup(groupId: string, assistant: Assistant) {
//     const group = assistantGroups.value.find((g) => g.id === groupId)
//     if (group) {
//       group.assistants.push(assistant)
//     }
//   }

//   function addIndividualAssistant(assistant: Assistant) {
//     individualAssistants.value.push(assistant)
//   }

//   function updateAssistantAvatar(
//     assistantId: string,
//     avatarUrl: string | null
//   ) {
//     const updateAssistant = (assistant: Assistant) => {
//       if (assistant.id === assistantId) {
//         assistant.avatar = avatarUrl
//       }
//     }

//     assistantGroups.value.forEach((group) =>
//       group.assistants.forEach(updateAssistant)
//     )
//     individualAssistants.value.forEach(updateAssistant)
//   }

//   return {
//     assistantGroups,
//     individualAssistants,
//     activeGroupId,
//     activeAssistantId,
//     allAssistants,
//     activeGroup,
//     activeAssistant,
//     currentAssistants,
//     setActiveAssistantOrGroup,
//     setActiveAssistant,
//     addAssistantGroup,
//     addAssistantToGroup,
//     addIndividualAssistant,
//     updateAssistantAvatar,
//   }
// })
