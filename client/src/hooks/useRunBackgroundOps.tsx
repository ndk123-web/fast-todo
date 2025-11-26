import { getPendingOperations, addPendingOperation, removePendingOperation } from "../store/indexDB/pendingOps/usePendingOps";
import createWorkspaceAPI from "../api/createWorkspaceApi";
import updateWorkspaceAPI from "../api/updateWorkspaceApi";
import useWorkspaceStore from "../store/useWorkspaceStore";
import deleteWorkspaceAPI from "../api/deleteWorkspaceApi";
import createTaskApi from "../api/createTaskApi";
import toggleTodoApi from "../api/toggleTaskApi";
import updateTaskApi from "../api/updateTaskApi";
import deleteTaskApi from "../api/deleteTaskApi";
import addGoalApi from "../api/addGoalApi";
import increamentGoalApi from "../api/increamentGoalApi";
import decreamentGoalApi from "../api/decreamentGoalApi";

let increamentGoalCount = 0;
let decreamentGoalCount = 0;

const pendingOps = async () => {
    const ops = await getPendingOperations();
    console.log("Pending Operations fetched:", ops);

    for (let op = 0 ; op < ops.length; op++) {
        if (ops[op].type === "CREATE_WORKSPACE" && ops[op].status === "PENDING") {
            // call create workspace API
            try {
                const response: any = await createWorkspaceAPI(ops[op].payload);
                
                if (response?.response.success !== "true") {
                    throw new Error("Failed to create workspace on server");
                }

                // Extract the workspace ID from server response
                const workspaceIdFromServer = response.response.workspaceId;
                console.log("Response from createWorkspaceAPI:", response);

                // Update workspace ID with the one from server and set status to SUCCESS
                const currentWorkspaces = useWorkspaceStore.getState().workspaces;
                const updatedWorkspaces = currentWorkspaces.map((ws) =>
                    ws.id === ops[op].payload.tempId
                        ? { ...ws, id: workspaceIdFromServer, status: "SUCCESS" }
                        : ws
                );

                // Update the store with new workspace ID and status
                useWorkspaceStore.setState({ workspaces: updatedWorkspaces });

                // If this was the current workspace, update it too
                const currentWorkspace = useWorkspaceStore.getState().currentWorkspace;
                if (currentWorkspace?.id === ops[op].payload.tempId) {
                    const updatedCurrentWorkspace = updatedWorkspaces.find(
                        (ws) => ws.id === workspaceIdFromServer
                    );
                    if (updatedCurrentWorkspace) {
                        useWorkspaceStore.setState({
                            currentWorkspace: updatedCurrentWorkspace,
                        });
                    }
                }

                // If successful, remove from pending operations
                await removePendingOperation(ops[op].id);
                
            } catch(error) {
                console.error("Error processing pending operation:", error);
                
                // Increment retry count
                ops[op].retryCount += 1;
                
                // If retry count exceeds limit (e.g., 3), mark as FAILED
                if (ops[op].retryCount >= 3) {
                    console.error("Max retry count reached for operation:", ops[op].id);
                    
                    // Update workspace status to FAILED in store
                    const currentWorkspaces = useWorkspaceStore.getState().workspaces;
                    const updatedWorkspaces = currentWorkspaces.map((ws) =>
                        ws.id === ops[op].payload.tempId
                            ? { ...ws, status: "FAILED" }
                            : ws
                    );
                    useWorkspaceStore.setState({ workspaces: updatedWorkspaces });
                    
                    // Remove from pending operations
                    await removePendingOperation(ops[op].id);
                } else {
                    // Update the retry count in pending operations
                    await addPendingOperation(ops[op]);
                }
                continue; // skip to next operation
            }
        }   
        else if (ops[op].type === "UPDATE_WORKSPACE" && ops[op].status === "PENDING") {
            try {
                const response: any = await updateWorkspaceAPI(ops[op].payload);
                console.log("Update Workspace API response:", response?.response);

                if (response?.response !== "Success") {
                    // if not success status change to failed
                    throw new Error("Failed to update workspace on server");
                }

                console.log("Response from updateWorkspaceAPI:", response);

                // if success update status to success
                const currentWorkspaces = useWorkspaceStore.getState().workspaces;
                const updatedWorkspaces = currentWorkspaces.map((ws) =>
                    ws.id === ops[op].id
                        ? { ...ws, name: ops[op].payload.updatedWorkspaceName, status: "SUCCESS" }
                        : ws
                );

                // Update the store with new workspace name and status
                useWorkspaceStore.getState().setWorkspace(updatedWorkspaces);

                // If this was the current workspace, update it too
                const currentWorkspace = useWorkspaceStore.getState().currentWorkspace;
                if (currentWorkspace?.id === ops[op].id) {
                    const updatedCurrentWorkspace = updatedWorkspaces.find(
                        (ws) => ws.id === ops[op].id
                    );
                    if (updatedCurrentWorkspace) {
                        useWorkspaceStore.setState({
                            currentWorkspace: updatedCurrentWorkspace,
                        });
                    }
                }

                // Remove from pending operations after success
                await removePendingOperation(ops[op].id);
            }
           catch(error) {
                console.error("Error processing pending operation:", error);
                
                // Increment retry count
                ops[op].retryCount += 1;
                
                // If retry count exceeds limit (e.g., 3), mark as FAILED
                if (ops[op].retryCount >= 3) {
                    console.error("Max retry count reached for operation:", ops[op].id);
                    
                    // Update workspace status to FAILED in store
                    const currentWorkspaces = useWorkspaceStore.getState().workspaces;
                    const updatedWorkspaces = currentWorkspaces.map((ws) =>
                        ws.id === ops[op].id
                            ? { ...ws, status: "FAILED" }
                            : ws
                    );
                    useWorkspaceStore.setState({ workspaces: updatedWorkspaces });
                    
                    // Remove from pending operations
                    await removePendingOperation(ops[op].id);
                } else {
                    // Update the retry count in pending operations
                    await addPendingOperation(ops[op]);
                }
                continue; // skip to next operation
            }
        }
        else if (ops[op].type === "DELETE_WORKSPACE" && ops[op].status === "PENDING") {
            try {
                const response: any = await deleteWorkspaceAPI(ops[op].payload);
                console.log("Delete Workspace API response:", response);

                if (response?.response !== "Success") {
                    throw new Error("Failed to delete workspace on server");
                }

                console.log("Response from deleteWorkspaceAPI:", response);
                // if success remove workspace from store 
            }
            catch(error) {
                console.error("Error processing pending operation:", error);
                // Increment retry count
                ops[op].retryCount += 1;

                // If retry count exceeds limit (e.g., 3), mark as FAILED
                if (ops[op].retryCount >= 3) {
                    console.error("Max retry count reached for operation:", ops[op].id);
                    // Remove from pending operations
                    await removePendingOperation(ops[op].id);
                } else {
                    // Update the retry count in pending operations
                    await addPendingOperation(ops[op]);
                }

                continue; // skip to next operation
            }
        }
        else if (ops[op].type === "CREATE_TODO" && ops[op].status === "PENDING") {
            try {
                const response: any = await createTaskApi(ops[op].payload);
                console.log("Create Task API response:", response);

                if (response?.success !== "true") {
                    throw new Error("Failed to create task on server");
                }

                const serverTodo = response.response;
                const newId = serverTodo?._id;
                const workspaceId = ops[op].payload.workspaceId;
                const tempId = ops[op].payload.id; // we stored optimistic todo under this id

                // Update workspaces array (replace tempId with server id and dedupe by id)
                const allWorkspaces = useWorkspaceStore.getState().workspaces;
                const updatedWorkspaces = allWorkspaces.map(ws => {
                    if (ws.id !== workspaceId) return ws;
                    const replaced = ws.todos.map(t =>
                        t.id === tempId ? { ...t, id: newId || t.id, status: "SUCCESS" } : t
                    );
                    const seen = new Set<string>();
                    const deduped = replaced.filter(t => {
                        const key = String(t.id);
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
                    return { ...ws, todos: deduped };
                });
                useWorkspaceStore.setState({ workspaces: updatedWorkspaces });

                // Update currentWorkspace if applicable
                const cw = useWorkspaceStore.getState().currentWorkspace;
                if (cw?.id === workspaceId) {
                    const updatedCw = updatedWorkspaces.find(w => w.id === workspaceId);
                    if (updatedCw) {
                        useWorkspaceStore.setState({ currentWorkspace: updatedCw });
                    }
                }

                await removePendingOperation(ops[op].id);
            } catch (error) {
                console.error("Error processing pending operation:", error);
                ops[op].retryCount += 1;
                if (ops[op].retryCount >= 3) {
                    console.error("Max retry count reached for operation:", ops[op].id);

                    const workspaceId = ops[op].payload.workspaceId;
                    const tempId = ops[op].payload.id;
                    const allWorkspaces = useWorkspaceStore.getState().workspaces;
                    const updatedWorkspaces = allWorkspaces.map(ws => ws.id === workspaceId ? {
                        ...ws,
                        todos: ws.todos.map(t => t.id === tempId ? { ...t, status: "FAILED" } : t)
                    } : ws);
                    useWorkspaceStore.setState({ workspaces: updatedWorkspaces });
                    const cw = useWorkspaceStore.getState().currentWorkspace;
                    if (cw?.id === workspaceId) {
                        const updatedCw = updatedWorkspaces.find(w => w.id === workspaceId);
                        if (updatedCw) useWorkspaceStore.setState({ currentWorkspace: updatedCw });
                    }

                    await removePendingOperation(ops[op].id);
                } else {
                    await addPendingOperation(ops[op]);
                }
            }
        }
        else if (ops[op].type === "TOGGLE_TODO" && ops[op].status === "PENDING") {
            try {
                const apiRes: any = await toggleTodoApi(ops[op].payload);
                // Backend returns { response: "true" } on success
    
                if (apiRes?.response !== "true") {
                    throw new Error("Failed to toggle todo on server");
                }
    
                console.log("✅ Todo toggled");
                
                // if success remove from pending operations
                await removePendingOperation(ops[op].id);
            }
            catch(error) {
                console.error("Error processing pending operation:", error);
                ops[op].retryCount += 1;
                if (ops[op].retryCount >= 3) {
                    console.error("Max retry count reached for operation:", ops[op].id);
                    await removePendingOperation(ops[op].id);
                } else {
                    await addPendingOperation(ops[op]);
                }
                continue; // skip to next operation
            }
        }
        else if (ops[op].type === "UPDATE_TODO" && ops[op].status === "PENDING") {
            try {
                 // API call
                const response: any = await updateTaskApi(ops[op].payload)
                console.log("Update Task API response:", response);

                if (response.success !== "true") {
                    throw new Error("Failed to update task on server");
                }
                console.log("Response from updateTaskApi:", response);

                // if success remove from pending operations
                await removePendingOperation(ops[op].id);
            }
            catch(error) {
                console.error("Error processing pending operation:", error);
                // Increment retry count
                ops[op].retryCount += 1;
                // If retry count exceeds limit (e.g., 3), mark as FAILED
                if (ops[op].retryCount >= 3) {
                    console.error("Max retry count reached for operation:", ops[op].id);
                    // Remove from pending operations
                    await removePendingOperation(ops[op].id);
                } else {
                    // Update the retry count in pending operations
                    await addPendingOperation(ops[op]);
                }
            }        
        }
        else if (ops[op].type === "DELETE_TODO" && ops[op].status === "PENDING") {
            try {
                const response: any = await deleteTaskApi(ops[op].payload);
                console.log("Response from deleteTaskApi:", response);

                if (response?.success !== "true") {
                    throw new Error("Failed to delete todo on server");
                }
                // if success remove from pending operations
                await removePendingOperation(ops[op].id);
            }
            catch(error) {
                console.error("Error processing pending operation:", error);
                // Increment retry count
                ops[op].retryCount += 1;
                // If retry count exceeds limit (e.g., 3), mark as FAILED
                if (ops[op].retryCount >= 3) {
                    console.error("Max retry count reached for operation:", ops[op].id);
                    // Remove from pending operations
                    await removePendingOperation(ops[op].id);
                } else {
                    // Update the retry count in pending operations
                    await addPendingOperation(ops[op]);
                }
            }
        }
        else if (ops[op].type === "ADD_GOAL" && ops[op].status === "PENDING") {
            try {
                const response: any = await addGoalApi(ops[op].payload)
                
                console.log("Response from addGoalApi:", response);
                
                if (response?.success !== "true") {
                    throw new Error("Failed to add goal on server");
                }
                console.log("✅ Goal added");
                
                // if success remove from pending operations
                await removePendingOperation(ops[op].id);

                // replace id with server id and update status to success in store
                const newId = response?.response?._id;
                const workspaceId = ops[op].payload.workspaceId;
                const tempId = ops[op].payload.id; // we stored optimistic goal under this id
                const allWorkspaces = useWorkspaceStore.getState().workspaces;
                const updatedWorkspaces = allWorkspaces.map(ws => {
                    if (ws.id !== workspaceId) return ws;
                    const replaced = ws.goals.map(g =>
                        g.id === tempId ? { ...g, id: newId || g.id, status: "SUCCESS" } : g
                    );
                    const seen = new Set<string>();
                    const deduped = replaced.filter(g => {
                        const key = String(g.id);
                        if (seen.has(key)) return false;
                        seen.add(key);
                        return true;
                    });
                    return { ...ws, goals: deduped };
                });
                useWorkspaceStore.setState({ workspaces: updatedWorkspaces });

                // Update currentWorkspace if applicable
                const cw = useWorkspaceStore.getState().currentWorkspace;
                if (cw?.id === workspaceId) {
                    const updatedCw = updatedWorkspaces.find(w => w.id === workspaceId);
                    if (updatedCw) {
                        useWorkspaceStore.setState({ currentWorkspace: updatedCw });
                    }
                }
            }
            catch(error){
                console.error("Error processing pending operation:", error);
                // Increment retry count
                ops[op].retryCount += 1;
                // If retry count exceeds limit (e.g., 3), mark as FAILED
                if (ops[op].retryCount >= 3) {
                    console.error("Max retry count reached for operation:", ops[op].id);
                    // Remove from pending operations
                    await removePendingOperation(ops[op].id);
                } else {
                    // Update the retry count in pending operations
                    await addPendingOperation(ops[op]);
                }
            }
        }
        else if (ops[op].type === "INCREAMENT_GOAL" && ops[op].status === "PENDING") {

            // batching increament operations
            if (op >= 0 && op < ops.length - 1 && (ops[op+1].payload.goalId === ops[op].payload.goalId)) {
                removePendingOperation(ops[op].id);
                increamentGoalCount++;
                continue;
            }

            try {
                const response : any = await increamentGoalApi({goalId: ops[op].payload.goalId , count: String(increamentGoalCount + 1)});
                console.log("Response from increamentGoalApi:", response);
                console.log("Increament Goal Count:", increamentGoalCount);
                
                if (response?.success !== "true") {
                    console.error("Failed to increament goal on server");
                    continue; // skip to next operation
                }

                console.log("✅ Goal increamented");
                
                // if success remove from pending operations
                await removePendingOperation(ops[op].id);
            }
            catch(error) {
                console.error("Error processing pending operation:", error);
                // Increment retry count
                ops[op].retryCount += 1;
                // If retry count exceeds limit (e.g., 3), mark as FAILED
                if (ops[op].retryCount >= 3) {
                    console.error("Max retry count reached for operation:", ops[op].id);
                    // Remove from pending operations
                    await removePendingOperation(ops[op].id);
                } else {
                    // Update the retry count in pending operations
                    await addPendingOperation(ops[op]);
                }
            }

        }
        else if (ops[op].type === "DECREAMENT_GOAL" && ops[op].status === "PENDING") {
            try {

                // batching decreament operations
                if (op >= 0 && op < ops.length - 1 && (ops[op+1].payload.goalId === ops[op].payload.goalId)) {
                    removePendingOperation(ops[op].id);
                    decreamentGoalCount++;
                    continue;
                }

                // api call
                const response : any = await decreamentGoalApi({goalId: ops[op].payload.goalId , count: String(decreamentGoalCount + 1)});
                console.log("Response from decreamentGoalApi:", response);
                console.log("Decreament Goal Count:", decreamentGoalCount);

                if (response?.success !== "true") {
                    console.error("Failed to decreament goal on server");
                    continue; // skip to next operation
                }
                console.log("✅ Goal decreamented");
                
                // if success remove from pending operations
                await removePendingOperation(ops[op].id);
            }
            catch(error) {
                console.error("Error processing pending operation:", error);
                // Increment retry count
                ops[op].retryCount += 1;
                // If retry count exceeds limit (e.g., 3), mark as FAILED
                if (ops[op].retryCount >= 3) {
                    console.error("Max retry count reached for operation:", ops[op].id);
                    // Remove from pending operations
                    await removePendingOperation(ops[op].id);
                } else {
                    // Update the retry count in pending operations
                    await addPendingOperation(ops[op]);
                }
            }
        }
    }
}

// reset count after processing all ops
increamentGoalCount = 0;
decreamentGoalCount = 0;

export default pendingOps;