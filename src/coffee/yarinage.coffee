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
    console.log @success


  #うけとる
  load:(url, options)->
    method = if options and options.method then options.method else 'GET'
    contentType = if options and options.contentType then options.contentType else 'application/x-msgpack'
    async = if options and options.async then options.async else true
    @success = if options and options.success then options.success else @success
    @error = if options and options.error then options.error else @error
    @xhr = @_setupXHR(method, url, async, true)  
    
    @xhr.onreadystatechange =()=>
      if @xhr.readyState is 4 and ( @xhr.status is 200 or @xhr.status is 304 )
        if @success
          rv = msgpack.unpack(new Uint8Array(@xhr.response))
          @success.apply(@, [rv])
          # @destory()
      else if @xhr.readyState is 4 and @xhr.status isnt 200
        if @error
          @error.apply(@, @xhr)
      else if @xhr.readyState is 4
        if @xhr.status is 400
          @error.apply(@, @xhr)
          # @destory()
      # else
        # console.log xhr
        # @destory()
    @xhr.send()

  #おくる
  upload:(url, data, options)->
    method = if options and options.method then options.method else 'POST'
    contentType = if options and options.contentType then options.contentType else 'application/x-msgpack; charset=x-user-defined'
    async = if options and options.async then options.async else true
    @success = if options and options.success then options.success else @success
    @error = if options and options.error then options.error else @error
    packed = msgpack.pack(data)
    buffer = new Uint8Array(packed).buffer
    @xhr = @_setupXHR(method, url, async)
    if options and options.responseType
      @xhr.responseType = options.responseType
    @xhr.setRequestHeader('Content-Type', contentType)
    @xhr.send(buffer)
    return @xhr


  _setupXHR:(method, url, async, load)->
    xhr = @_createXHR()
    if xhr is null
      throw new Error('your browser だめぽ')
    xhr.open( method, url, async )
    if load is true
      xhr.responseType = 'arraybuffer'
    xhr.onreadystatechange =()=>
      if xhr.readyState is 4 and ( xhr.status is 200 or xhr.status is 304 )
        if @success
          @success.apply(@, [xhr.response])
          # @destory()
      else if xhr.readyState is 4 and xhr.status isnt 200
        if @error
          @error.apply(@, [xhr])
      else if xhr.readyState is 4
        if xhr.status is 400
          @error.apply(@, [xhr])
      else if xhr.readyState is 3 and xhr.status is 400
        @error.apply(@, [xhr])

          # @destory()
      # else if xhr.status is 403
        #@abort()
        # @error.apply()
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
