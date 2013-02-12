###
  msgpack yari tori suru
###
class Yarinage
  xhr:null
  success:null
  error:null

  constructor:(options)->
    @success = if options and options.success then options.success else null
    @error = if options and options.error then options.error else null
    ua = navigator.userAgent
    @isChrome = if ua.match(/Chrome\/\d+/g) then true else false

  #うけとる
  load:(url, options)->
    method = if options and options.method then options.method else 'GET'
    contentType = if options and options.contentType then options.contentType else 'application/x-msgpack'
    async = if options and options.async then options.async else true
    @success = if options and options.success then options.success else @success
    @error = if options and options.error then options.error else @error
    @xhr = @_setupXHR(method, url, async, true)
    
    @xhr.onreadystatechange =()=>
      if @xhr.readyState is 4
        if @xhr.status is 200 or @xhr.status is 304
          if @success
            rv = msgpack.unpack(new Uint8Array(@xhr.response))
            @success.apply(@, [rv])
        else
          if @error
            @error.apply(@, @xhr)
      else
        if @xhr.status isnt 200 and @xhr.status isnt 304
          @error.apply(@, @xhr)
      
    @xhr.send()

  #おくる
  upload:(url, data, options)->
    method = if options and options.method then options.method else 'POST'
    contentType = if options and options.contentType then options.contentType else 'application/x-msgpack; charset=x-user-defined'
    async = if options and options.async then options.async else true
    @success = if options and options.success then options.success else @success
    @error = if options and options.error then options.error else @error
    packed = msgpack.pack(data)
    bin = new Uint8Array(packed)
    @xhr = @_setupXHR(method, url, async)
    if options and options.responseType
      @xhr.responseType = options.responseType
    @xhr.setRequestHeader('Content-Type', contentType)
    
    if @isChrome
      @xhr.send(bin)
    else
      @xhr.send(bin.buffer)
    return @xhr


  _setupXHR:(method, url, async, load)->
    xhr = @_createXHR()
    if xhr is null
      throw new Error('your browser だめぽ')
    xhr.open( method, url, async )
    if load is true
      xhr.responseType = 'arraybuffer'
    xhr.onreadystatechange =()=>
      if xhr.readyState is 4
        if xhr.status is 200 or xhr.status is 304
          if @success
            @success.apply(@, [xhr.response])
        else
          if @error
            @error.apply(@, [xhr])
      else
        if @xhr.status isnt 200 and @xhr.status isnt 304
          @error.apply(@, [xhr])
    return xhr

  #XMLHttpRequest つくる
  _createXHR:()->
    if window.ActiveXObject
      try
        return new ActiveXObject("Msxml2.XMLHTTP")
      catch e
        try
          return new ActiveXObject("Microsoft.XMLHTTP")
        catch e
          return null
    else if window.XMLHttpRequest
      return new XMLHttpRequest()
    else
      return null

  destory:()->
    @xhr = null
    @success = null
    @error = null
