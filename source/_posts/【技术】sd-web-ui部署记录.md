---
title: sd-web-ui部署记录
date: 2024年01月02日10:13:22
excerpt: 用秋叶大佬的镜像绘图，安装ip-adapter插件提示环境不兼容，重新升级机器上的sd-web-ui。
photos: '../images/code-example.jpg'
tags:
  - AIGC
categories:
  - 技术
---


<!--more-->

[done]1、重装后启动问题
```text
/mnt/workspace/stable-diffusion-webui
Traceback (most recent call last):
  File "/mnt/workspace/stable-diffusion-webui/launch.py", line 1, in <module>
    from modules import launch_utils
  File "/opt/conda/lib/python3.10/site-packages/MultiScaleDeformableAttention-1.0-py3.10-linux-x86_64.egg/modules/__init__.py", line 12, in <module>
    from .ms_deform_attn import MSDeformAttn
  File "/opt/conda/lib/python3.10/site-packages/MultiScaleDeformableAttention-1.0-py3.10-linux-x86_64.egg/modules/ms_deform_attn.py", line 21, in <module>
    from ..functions import MSDeformAttnFunction
ImportError: attempted relative import beyond top-level package
```
https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues/12314
原因是全局包 multiscaledeformableattention 同样会导出module，导致系统误认为这是需要找到的module 
我这是阿里云的虚拟环境，所以直接 pip uninstall multiscaledeformableattention 解决问题

[done]2、tagger有问题
原先使用的是 https://github.com/toriato/stable-diffusion-webui-wd14-tagger.git
后面修改为 https://github.com/picobyte/stable-diffusion-webui-wd14-tagger.git
参考 https://github.com/AUTOMATIC1111/stable-diffusion-webui/issues/13208#issuecomment-1715821041

2024-01-02 13:22:51.177732: W tensorflow/compiler/tf2tensorrt/utils/py_utils.cc:38] TF-TRT Warning: Could not find TensorRT
*** Error running preload() for /mnt/workspace/stable-diffusion-webui/extensions/stable-diffusion-webui-wd14-tagger/preload.py
    Traceback (most recent call last):
      File "/mnt/workspace/stable-diffusion-webui/modules/script_loading.py", line 26, in preload_extensions
        module = load_module(preload_script)
      File "/mnt/workspace/stable-diffusion-webui/modules/script_loading.py", line 10, in load_module
        module_spec.loader.exec_module(module)
      File "<frozen importlib._bootstrap_external>", line 883, in exec_module
      File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
      File "/mnt/workspace/stable-diffusion-webui/extensions/stable-diffusion-webui-wd14-tagger/preload.py", line 4, in <module>
        from modules.shared import models_path
    ImportError: cannot import name 'models_path' from partially initialized module 'modules.shared' (most likely due to a circular import) (/mnt/workspace/stable-diffusion-webui/modules/shared.py)

【done】3、同上，引用的web插件存在问题，更换web插件的源
*** Error loading script: tagger.py
    Traceback (most recent call last):
      File "/mnt/workspace/stable-diffusion-webui/modules/scripts.py", line 469, in load_scripts
        script_module = script_loading.load_module(scriptfile.path)
      File "/mnt/workspace/stable-diffusion-webui/modules/script_loading.py", line 10, in load_module
        module_spec.loader.exec_module(module)
      File "<frozen importlib._bootstrap_external>", line 883, in exec_module
      File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
      File "/mnt/workspace/stable-diffusion-webui/extensions/stable-diffusion-webui-wd14-tagger/scripts/tagger.py", line 5, in <module>
        from tagger.ui import on_ui_tabs
      File "/mnt/workspace/stable-diffusion-webui/extensions/stable-diffusion-webui-wd14-tagger/tagger/ui.py", line 10, in <module>
        from webui import wrap_gradio_gpu_call
    ImportError: cannot import name 'wrap_gradio_gpu_call' from 'webui' (/mnt/workspace/stable-diffusion-webui/webui.py)

【done】4、无法加载 controlnet 模型
由于本地不存在模型openai/clip-vit-large-patch14，webui启动的时候，会尝试从网络加载，然后就杯具了。
Creating model from config: /mnt/workspace/stable-diffusion-webui/configs/v1-inference.yaml
creating model quickly: OSError
Traceback (most recent call last):
  File "/opt/conda/lib/python3.10/threading.py", line 973, in _bootstrap
    self._bootstrap_inner()
  File "/opt/conda/lib/python3.10/threading.py", line 1016, in _bootstrap_inner
    self.run()
  File "/opt/conda/lib/python3.10/threading.py", line 953, in run
    self._target(*self._args, **self._kwargs)
  File "/mnt/workspace/stable-diffusion-webui/modules/initialize.py", line 147, in load_model
    shared.sd_model  # noqa: B018
  File "/mnt/workspace/stable-diffusion-webui/modules/shared_items.py", line 128, in sd_model
    return modules.sd_models.model_data.get_sd_model()
  File "/mnt/workspace/stable-diffusion-webui/modules/sd_models.py", line 531, in get_sd_model
    load_model()
  File "/mnt/workspace/stable-diffusion-webui/modules/sd_models.py", line 634, in load_model
    sd_model = instantiate_from_config(sd_config.model)
  File "/mnt/workspace/stable-diffusion-webui/repositories/stable-diffusion-stability-ai/ldm/util.py", line 89, in instantiate_from_config
    return get_obj_from_str(config["target"])(**config.get("params", dict()))
  File "/mnt/workspace/stable-diffusion-webui/repositories/stable-diffusion-stability-ai/ldm/models/diffusion/ddpm.py", line 563, in __init__
    self.instantiate_cond_stage(cond_stage_config)
  File "/mnt/workspace/stable-diffusion-webui/repositories/stable-diffusion-stability-ai/ldm/models/diffusion/ddpm.py", line 630, in instantiate_cond_stage
    model = instantiate_from_config(config)
  File "/mnt/workspace/stable-diffusion-webui/repositories/stable-diffusion-stability-ai/ldm/util.py", line 89, in instantiate_from_config
    return get_obj_from_str(config["target"])(**config.get("params", dict()))
  File "/mnt/workspace/stable-diffusion-webui/repositories/stable-diffusion-stability-ai/ldm/modules/encoders/modules.py", line 103, in __init__
    self.tokenizer = CLIPTokenizer.from_pretrained(version)
  File "/opt/conda/lib/python3.10/site-packages/transformers/tokenization_utils_base.py", line 1809, in from_pretrained
    raise EnvironmentError(
OSError: Can't load tokenizer for 'openai/clip-vit-large-patch14'. If you were trying to load it from 'https://huggingface.co/models', make sure you don't have a local directory with the same name. Otherwise, make sure 'openai/clip-vit-large-patch14' is the correct path to a directory containing all relevant files for a CLIPTokenizer tokenizer.

参考了两篇文章
https://github.com/CompVis/stable-diffusion/issues/90
这里介绍的方法，在最新的webui中已经默认修复了
但是下面有个回答给仙人指路
https://github.com/CompVis/stable-diffusion/issues/90#issuecomment-1808073355
这里提到模型下载问题，阿里云确实无法下载huggingface模型，于是参考这篇文章，进行修改
https://blog.csdn.net/SuperB666/article/details/132826492
先下载所需的文件，并存放到webui根目录的.cache文件下，最终路径如下
/mnt/workspace/.cache/modelscope/huggingface/transformers
然后修改如下文件中对 openai/clip-vit-large-patch14 的引用为上面文件夹
/mnt/workspace/stable-diffusion-webui/repositories/generative-models/sgm/modules/encoders/modules.py
/mnt/workspace/stable-diffusion-webui/repositories/stable-diffusion-stability-ai/ldm/modules/encoders/modules.py

【done】5、仍然是插件问题，直接干掉了text2video插件（暂时不影响我的目的，所以先删除）
*** Error loading script: api_t2v.py
    Traceback (most recent call last):
      File "/mnt/workspace/stable-diffusion-webui/modules/scripts.py", line 469, in load_scripts
        script_module = script_loading.load_module(scriptfile.path)
      File "/mnt/workspace/stable-diffusion-webui/modules/script_loading.py", line 10, in load_module
        module_spec.loader.exec_module(module)
      File "<frozen importlib._bootstrap_external>", line 883, in exec_module
      File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-text2video/scripts/api_t2v.py", line 39, in <module>
        from t2v_helpers.args import T2VArgs_sanity_check, T2VArgs, T2VOutputArgs
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-text2video/scripts/t2v_helpers/args.py", line 7, in <module>
        from samplers.samplers_common import available_samplers
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-text2video/scripts/samplers/samplers_common.py", line 3, in <module>
        from samplers.ddim.gaussian_sampler import GaussianDiffusion
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-text2video/scripts/samplers/ddim/gaussian_sampler.py", line 2, in <module>
        from modelscope.t2v_model import _i
    ModuleNotFoundError: No module named 'modelscope.t2v_model'

*** Error loading script: text2vid.py
    Traceback (most recent call last):
      File "/mnt/workspace/stable-diffusion-webui/modules/scripts.py", line 469, in load_scripts
        script_module = script_loading.load_module(scriptfile.path)
      File "/mnt/workspace/stable-diffusion-webui/modules/script_loading.py", line 10, in load_module
        module_spec.loader.exec_module(module)
      File "<frozen importlib._bootstrap_external>", line 883, in exec_module
      File "<frozen importlib._bootstrap>", line 241, in _call_with_frames_removed
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-text2video/scripts/text2vid.py", line 24, in <module>
        from t2v_helpers.render import run
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-text2video/scripts/t2v_helpers/render.py", line 5, in <module>
        from modelscope.process_modelscope import process_modelscope
    ModuleNotFoundError: No module named 'modelscope.process_modelscope'

【done】6、同样移除了civitai浏览器插件，防止报错
*** Error executing callback ui_tabs_callback for /mnt/workspace/stable-diffusion-webui/extensions/sd-civitai-browser-plus/scripts/civitai_gui.py
    Traceback (most recent call last):
      File "/opt/conda/lib/python3.10/site-packages/urllib3/connection.py", line 174, in _new_conn
        conn = connection.create_connection(
      File "/opt/conda/lib/python3.10/site-packages/urllib3/util/connection.py", line 95, in create_connection
        raise err
      File "/opt/conda/lib/python3.10/site-packages/urllib3/util/connection.py", line 85, in create_connection
        sock.connect(sa)
    OSError: [Errno 101] Network is unreachable

    During handling of the above exception, another exception occurred:

    Traceback (most recent call last):
      File "/opt/conda/lib/python3.10/site-packages/urllib3/connectionpool.py", line 714, in urlopen
        httplib_response = self._make_request(
      File "/opt/conda/lib/python3.10/site-packages/urllib3/connectionpool.py", line 403, in _make_request
        self._validate_conn(conn)
      File "/opt/conda/lib/python3.10/site-packages/urllib3/connectionpool.py", line 1053, in _validate_conn
        conn.connect()
      File "/opt/conda/lib/python3.10/site-packages/urllib3/connection.py", line 363, in connect
        self.sock = conn = self._new_conn()
      File "/opt/conda/lib/python3.10/site-packages/urllib3/connection.py", line 186, in _new_conn
        raise NewConnectionError(
    urllib3.exceptions.NewConnectionError: <urllib3.connection.HTTPSConnection object at 0x7fe8225bb940>: Failed to establish a new connection: [Errno 101] Network is unreachable

    During handling of the above exception, another exception occurred:

    Traceback (most recent call last):
      File "/opt/conda/lib/python3.10/site-packages/requests/adapters.py", line 486, in send
        resp = conn.urlopen(
      File "/opt/conda/lib/python3.10/site-packages/urllib3/connectionpool.py", line 798, in urlopen
        retries = retries.increment(
      File "/opt/conda/lib/python3.10/site-packages/urllib3/util/retry.py", line 592, in increment
        raise MaxRetryError(_pool, url, error or ResponseError(cause))
    urllib3.exceptions.MaxRetryError: HTTPSConnectionPool(host='civitai.com', port=443): Max retries exceeded with url: /api/v1/models?baseModels=checkOptions (Caused by NewConnectionError('<urllib3.connection.HTTPSConnection object at 0x7fe8225bb940>: Failed to establish a new connection: [Errno 101] Network is unreachable'))

    During handling of the above exception, another exception occurred:

    Traceback (most recent call last):
      File "/mnt/workspace/stable-diffusion-webui/modules/script_callbacks.py", line 166, in ui_tabs_callback
        res += c.callback() or []
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-civitai-browser-plus/scripts/civitai_gui.py", line 160, in on_ui_tabs
        base_filter = gr.Dropdown(label='Base model:', multiselect=True, choices=getBaseModelOptions(), value=None, type="value", elem_id="centerText")
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-civitai-browser-plus/scripts/civitai_gui.py", line 106, in getBaseModelOptions
        baseModelReturn = requests.get("https://civitai.com/api/v1/models?baseModels=checkOptions")
      File "/opt/conda/lib/python3.10/site-packages/requests/api.py", line 73, in get
        return request("get", url, params=params, **kwargs)
      File "/opt/conda/lib/python3.10/site-packages/requests/api.py", line 59, in request
        return session.request(method=method, url=url, **kwargs)
      File "/opt/conda/lib/python3.10/site-packages/requests/sessions.py", line 589, in request
        resp = self.send(prep, **send_kwargs)
      File "/opt/conda/lib/python3.10/site-packages/requests/sessions.py", line 703, in send
        r = adapter.send(request, **kwargs)
      File "/opt/conda/lib/python3.10/site-packages/requests/adapters.py", line 519, in send
        raise ConnectionError(e, request=request)
    requests.exceptions.ConnectionError: HTTPSConnectionPool(host='civitai.com', port=443): Max retries exceeded with url: /api/v1/models?baseModels=checkOptions (Caused by NewConnectionError('<urllib3.connection.HTTPSConnection object at 0x7fe8225bb940>: Failed to establish a new connection: [Errno 101] Network is unreachable'))

7、文生图报错
** Error running postprocess_batch_list: /mnt/workspace/stable-diffusion-webui/extensions/sd-webui-comfyui/scripts/comfyui.py
    Traceback (most recent call last):
      File "/mnt/workspace/stable-diffusion-webui/modules/scripts.py", line 766, in postprocess_batch_list
        script.postprocess_batch_list(p, pp, *script_args, **kwargs)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-comfyui/scripts/comfyui.py", line 57, in postprocess_batch_list
        iframe_requests.extend_infotext_with_comfyui_workflows(p, self.get_tab())
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-comfyui/lib_comfyui/comfyui/iframe_requests.py", line 121, in extend_infotext_with_comfyui_workflows
        ComfyuiIFrameRequests.validate_amount_of_nodes_or_throw(
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-comfyui/lib_comfyui/ipc/__init__.py", line 41, in wrapper
        return function(*args, **kwargs)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-comfyui/lib_comfyui/comfyui/iframe_requests.py", line 78, in validate_amount_of_nodes_or_throw
        workflow_graph = get_workflow_graph(workflow_type_id)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-comfyui/lib_comfyui/comfyui/iframe_requests.py", line 145, in get_workflow_graph
        return ComfyuiIFrameRequests.send(request='webui_serialize_graph', workflow_type=workflow_type_id)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-comfyui/lib_comfyui/ipc/__init__.py", line 20, in wrapper
        res = current_callback_proxies[process_id].get(args=(function.__module__, function.__qualname__, args, kwargs))
    KeyError: 'comfyui'

---

8、
Could not create share link. Missing file: /opt/conda/lib/python3.10/site-packages/gradio/frpc_linux_amd64_v0.2. 

Please check your internet connection. This can happen if your antivirus software blocks the download of this file. You can install manually by following these steps: 

1. Download this file: https://cdn-media.huggingface.co/frpc-gradio-0.2/frpc_linux_amd64
2. Rename the downloaded file to: frpc_linux_amd64_v0.2
3. Move the file to this location: /opt/conda/lib/python3.10/site-packages/gradio
[sd-webui-comfyui] Could not find ComfyUI under directory "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-comfyui/ComfyUI". The server will NOT be started.
Startup time: 157.0s (prepare environment: 6.7s, import torch: 7.9s, import gradio: 1.8s, setup paths: 0.5s, initialize shared: 0.2s, other imports: 0.7s, load scripts: 2.2s, create ui: 0.8s, gradio launch: 136.0s).

【done】9、添加双controlnet模型: openpose ip-adapter报错
  手动从镜像网站下载文件到指定位置
2024-01-02 14:52:12,818 - ControlNet - INFO - unit_separate = False, style_align = False
2024-01-02 14:52:13,326 - ControlNet - INFO - Loading model: control_v11p_sd15_openpose [cab727d4]
2024-01-02 14:52:14,276 - ControlNet - INFO - Loaded state_dict from [/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/models/control_v11p_sd15_openpose.pth]
2024-01-02 14:52:14,277 - ControlNet - INFO - controlnet_default_config
2024-01-02 14:52:17,595 - ControlNet - INFO - ControlNet model control_v11p_sd15_openpose [cab727d4] loaded.
2024-01-02 14:52:17,624 - ControlNet - INFO - Loading preprocessor: openpose_full
2024-01-02 14:52:17,625 - ControlNet - INFO - preprocessor resolution = 512
2024-01-02 14:52:18,131 - ControlNet - INFO - Loading model: ip-adapter-full-face_sd15 [852b9843]
2024-01-02 14:52:18,133 - ControlNet - INFO - Loaded state_dict from [/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/models/ip-adapter-full-face_sd15.safetensors]
2024-01-02 14:52:18,325 - ControlNet - INFO - ControlNet model ip-adapter-full-face_sd15 [852b9843] loaded.
2024-01-02 14:52:18,332 - ControlNet - INFO - Loading preprocessor: ip-adapter_clip_sd15
2024-01-02 14:52:18,332 - ControlNet - INFO - preprocessor resolution = 512
Downloading: "https://huggingface.co/h94/IP-Adapter/resolve/main/models/image_encoder/pytorch_model.bin" to /mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/annotator/downloads/clip_vision/clip_h.pth

*** Error running process: /mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/controlnet.py
    Traceback (most recent call last):
      File "/opt/conda/lib/python3.10/urllib/request.py", line 1348, in do_open
        h.request(req.get_method(), req.selector, req.data, headers,
      File "/opt/conda/lib/python3.10/http/client.py", line 1283, in request
        self._send_request(method, url, body, headers, encode_chunked)
      File "/opt/conda/lib/python3.10/http/client.py", line 1329, in _send_request
        self.endheaders(body, encode_chunked=encode_chunked)
      File "/opt/conda/lib/python3.10/http/client.py", line 1278, in endheaders
        self._send_output(message_body, encode_chunked=encode_chunked)
      File "/opt/conda/lib/python3.10/http/client.py", line 1038, in _send_output
        self.send(msg)
      File "/opt/conda/lib/python3.10/http/client.py", line 976, in send
        self.connect()
      File "/opt/conda/lib/python3.10/http/client.py", line 1448, in connect
        super().connect()
      File "/opt/conda/lib/python3.10/http/client.py", line 942, in connect
        self.sock = self._create_connection(
      File "/opt/conda/lib/python3.10/socket.py", line 845, in create_connection
        raise err
      File "/opt/conda/lib/python3.10/socket.py", line 833, in create_connection
        sock.connect(sa)
    OSError: [Errno 101] Network is unreachable

    During handling of the above exception, another exception occurred:

    Traceback (most recent call last):
      File "/mnt/workspace/stable-diffusion-webui/modules/scripts.py", line 718, in process
        script.process(p, *script_args)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/controlnet.py", line 1091, in process
        self.controlnet_hack(p)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/controlnet.py", line 1076, in controlnet_hack
        self.controlnet_main_entry(p)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/controlnet.py", line 907, in controlnet_main_entry
        detected_map, is_image = preprocessor(
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/utils.py", line 75, in decorated_func
        return cached_func(*args, **kwargs)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/utils.py", line 63, in cached_func
        return func(*args, **kwargs)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/global_state.py", line 37, in unified_preprocessor
        return preprocessor_modules[preprocessor_name](*args, **kwargs)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/scripts/processor.py", line 353, in clip
        clip_encoder[config] = ClipVisionDetector(config)
      File "/mnt/workspace/stable-diffusion-webui/extensions/sd-webui-controlnet/annotator/clipvision/__init__.py", line 99, in __init__
        load_file_from_url(url=self.download_link, model_dir=self.model_path, file_name=self.file_name)
      File "/mnt/workspace/stable-diffusion-webui/modules/modelloader.py", line 32, in load_file_from_url
        download_url_to_file(url, cached_file, progress=progress)
      File "/opt/conda/lib/python3.10/site-packages/torch/hub.py", line 620, in download_url_to_file
        u = urlopen(req)
      File "/opt/conda/lib/python3.10/urllib/request.py", line 216, in urlopen
        return opener.open(url, data, timeout)
      File "/opt/conda/lib/python3.10/urllib/request.py", line 519, in open
        response = self._open(req, data)
      File "/opt/conda/lib/python3.10/urllib/request.py", line 536, in _open
        result = self._call_chain(self.handle_open, protocol, protocol +
      File "/opt/conda/lib/python3.10/urllib/request.py", line 496, in _call_chain
        result = func(*args)
      File "/opt/conda/lib/python3.10/urllib/request.py", line 1391, in https_open
        return self.do_open(http.client.HTTPSConnection, req,
      File "/opt/conda/lib/python3.10/urllib/request.py", line 1351, in do_open
        raise URLError(err)
    urllib.error.URLError: <urlopen error [Errno 101] Network is unreachable>


## chatgpt 部署尝试
调用chatgpt api(gpt-4)时，返回的回答一直是中文，但同样的prompt在web界面调用，返回的一直为英文
prompt: https://raw.githubusercontent.com/weisiwu/novel_test/main/documents/sd_prompt_generate.prompt

调用的时候分成了多次的 conversation
```
def conversation(messages, model="gpt-4"):
    stream = openai.chat.completions.create(
        model=model,
        messages=messages,
        stream=True,
    )
```
错误的调用方式:
```
messages=[{'role': 'system', 'content': ''}]
messages=[{'role': 'user', 'content': ''}]
messages=[{'role': 'user', 'content': ''}]
```
正确的调用方式
```
messages=[
  {'role': 'system', 'content': ''},
  {'role': 'user', 'content': ''},
  {'role': 'user', 'content': ''},
]
```

## colab部署尝试
由于阿里云的PAI-DSW仅是用于训练模型的，不能对外提供api使用。寻找替代访问
沟通的工单内容
https://smartservice.console.aliyun.com/service/chat?id=0002HASYMX
colab
https://github.com/AUTOMATIC1111/stable-diffusion-webui/discussions/4561
发现colab可以部署，但是不允许以API形式启动，如果发现违规，那么会将实例释放，释放后，下载的代码和训练的物料都互小时。
另非plus实例最多保存12小时